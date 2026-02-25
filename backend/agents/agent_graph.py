import os
from typing import TypedDict, Annotated, List, Union, Literal
from langchain_openai import ChatOpenAI
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, ToolMessage
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
import agents.tools as agent_tools
from langchain_core.tools import tool
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from pydantic import BaseModel, Field

# --- Tools ---

@tool
def search_products(query: str):
    """Search for products in the e-commerce store catalog."""
    return agent_tools.get_product_list(search=query)

@tool
def add_to_cart(product_id: int, quantity: int = 1, user_id: int = 1):
    """Add a product to the shopping cart. Note: user_id is handled by the system."""
    return agent_tools.add_item_to_cart(user_id=user_id, product_id=product_id, quantity=quantity)

@tool
def view_cart(user_id: int = 1):
    """View the items currently in the shopping cart."""
    return agent_tools.get_cart_contents(user_id=user_id)

@tool
def checkout(shipping_address: str, user_id: int = 1):
    """Submit the order for the items in the cart."""
    return agent_tools.perform_checkout(user_id=user_id, shipping_address=shipping_address)

# Specialized Tool Sets
search_tools = [search_products]
cart_tools = [add_to_cart, view_cart, checkout]

# --- State ---

class AgentState(TypedDict):
    messages: Annotated[List[BaseMessage], lambda x, y: x + y]
    next: str
    user_id: int

# --- Helper to create agents ---

def create_agent(llm, tools, system_prompt: str):
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        MessagesPlaceholder(variable_name="messages"),
    ])
    if tools:
        return prompt | llm.bind_tools(tools)
    return prompt | llm

# --- Supervisor ---

members = ["ProductSearch", "CartManager"]
system_prompt = (
    "You are the Supervisor for the E-commerce AI Assistant. This assistant is an extension "
    "of the existing store's web interface. Your job is to route user requests to specialized "
    "workers: {members}. \n"
    "- Use 'ProductSearch' to help users find items in the catalog.\n"
    "- Use 'CartManager' for anything involving the shopping cart, viewing items, or checkout.\n"
    "Respond with the worker to act next or 'FINISH' if the user's request is satisfied."
)

class Router(BaseModel):
    next: Literal["ProductSearch", "CartManager", "FINISH"]

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

supervisor_prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    MessagesPlaceholder(variable_name="messages"),
    ("human", "Given the conversation above, who should act next? Or should we FINISH?"),
]).partial(members=", ".join(members))

supervisor_chain = supervisor_prompt | llm.with_structured_output(Router)

def supervisor_node(state: AgentState):
    """Supervisor decision node."""
    response = supervisor_chain.invoke(state)
    return {"next": response.next}

# --- Worker Nodes ---

def product_search_node(state: AgentState):
    agent = create_agent(llm, search_tools, "You are a product search expert for our e-commerce store. Help users find exactly what they need.")
    result = agent.invoke(state["messages"])
    return {"messages": [result]}

def cart_manager_node(state: AgentState):
    agent = create_agent(llm, cart_tools, f"You are the Cart Manager for User #{state['user_id']}. Help them manage their selection and complete their purchase.")
    result = agent.invoke(state["messages"])
    return {"messages": [result]}

# --- Graph Construction ---

workflow = StateGraph(AgentState)

workflow.add_node("ProductSearch", product_search_node)
workflow.add_node("CartManager", cart_manager_node)
workflow.add_node("Supervisor", supervisor_node)

# Workers always go back to supervisor
workflow.add_edge("ProductSearch", "Supervisor")
workflow.add_edge("CartManager", "Supervisor")

# Supervisor decides where to go
workflow.add_conditional_edges(
    "Supervisor",
    lambda x: x["next"],
    {
        "ProductSearch": "ProductSearch",
        "CartManager": "CartManager",
        "FINISH": END,
    }
)

# Add Tool Nodes
def execute_search_tools(state: AgentState):
    # Search tools don't need user_id injection (public catalog)
    tn = ToolNode(search_tools)
    return tn.invoke(state)

def execute_cart_tools(state: AgentState):
    # Inject user_id into cart tool calls safely
    last_message = state["messages"][-1]
    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        # We modify the tool calls in the message for ToolNode to use
        for tc in last_message.tool_calls:
            if tc["name"] in ["add_to_cart", "view_cart", "checkout"]:
                tc["args"]["user_id"] = state["user_id"]
    
    tn = ToolNode(cart_tools)
    return tn.invoke(state)

workflow.add_node("search_tools", execute_search_tools)
workflow.add_node("cart_tools", execute_cart_tools)

# Handle tool calls for workers
def tool_routing(state: AgentState):
    messages = state["messages"]
    last_message = messages[-1]
    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        # Determine which tool set to use based on the tool name
        tool_name = last_message.tool_calls[0]["name"]
        if tool_name == "search_products":
            return "search_tools"
        else:
            return "cart_tools"
    return "Supervisor"

workflow.add_conditional_edges("ProductSearch", tool_routing, {"search_tools": "search_tools", "Supervisor": "Supervisor"})
workflow.add_conditional_edges("CartManager", tool_routing, {"cart_tools": "cart_tools", "Supervisor": "Supervisor"})

workflow.add_edge("search_tools", "ProductSearch")
workflow.add_edge("cart_tools", "CartManager")

workflow.set_entry_point("Supervisor")

graph = workflow.compile()

async def run_agent(query: str, user_id: int):
    # State includes the authenticated user_id
    inputs = {"messages": [HumanMessage(content=query)], "user_id": user_id}
    result = await graph.ainvoke(inputs)
    
    # Filter for the final AI message from a worker or the last meaningful response
    for message in reversed(result["messages"]):
        if isinstance(message, AIMessage) and message.content:
            return message.content
    return "How else can I help you with your shopping today?"
