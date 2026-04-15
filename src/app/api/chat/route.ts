import { NextResponse } from 'next/server';
import { getDashboardStats } from '@/lib/data';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ reply: "Please provide a valid message." }, { status: 400 });
    }

    const lowerMessage = message.toLowerCase();
    
    // Fetch stats once to use in responses
    const stats = await getDashboardStats();

    // If-Else Keyword Matcher
    if (lowerMessage.includes('revenue') || lowerMessage.includes('money') || lowerMessage.includes('sales')) {
      const formattedRevenue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(stats.totalRevenue);
      return NextResponse.json({ reply: `Our total revenue across all payments is ${formattedRevenue}.` });
    } 
    
    else if (lowerMessage.includes('customer')) {
      return NextResponse.json({ reply: `We currently have a total of ${stats.totalCustomers.toLocaleString()} customers in the database.` });
    } 
    
    else if (lowerMessage.includes('order')) {
      return NextResponse.json({ reply: `There are a total of ${stats.totalOrders.toLocaleString()} orders recorded.` });
    } 
    
    else if (lowerMessage.includes('product') && lowerMessage.includes('manage')) {
       return NextResponse.json({ reply: `You can manage products by clicking the "Manage Products" button on the dashboard header.` });
    }
    
    else {
      // Fallback help response
      return NextResponse.json({ 
        reply: "I'm a simple bot! I can tell you about our 'revenue', 'customers', or 'orders'. Try asking me one of those!" 
      });
    }

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ reply: "Sorry, I encountered an error trying to process your request." }, { status: 500 });
  }
}
