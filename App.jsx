import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("subscribed") === "true") {
      setIsSubscribed(true);
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-white text-gray-800">
        <header className="p-4 shadow-md flex justify-between items-center">
          <h1 className="text-2xl font-bold">Homi</h1>
          <nav>
            <Link to="/" className="mr-4">Home</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/dashboard">Dashboard</Link>
            {!isAuthenticated ? (
              <Button onClick={() => setIsAuthenticated(true)}>Login</Button>
            ) : (
              <Button onClick={() => {
                setIsAuthenticated(false);
                setIsSubscribed(false);
              }}>Logout</Button>
            )}
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing setIsSubscribed={setIsSubscribed} />} />
          <Route path="/dashboard" element={
            isAuthenticated ? (
              <Dashboard isSubscribed={isSubscribed} />
            ) : (
              <Navigate to="/" />
            )
          } />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="p-8 text-center">
      <h2 className="text-3xl font-bold mb-4">Connecting you with your dream home</h2>
      <p className="mb-8">Streamline service for real estate agents and clients to access listings, information, and documents.</p>
      <div className="flex justify-center">
        <input placeholder="Enter address, city, ZIP" className="border p-2 w-64 rounded-l" />
        <Button>Search</Button>
      </div>
    </div>
  );
}

function Pricing({ setIsSubscribed }) {
  const handleSubscribe = async () => {
    const stripe = await window.Stripe("pk_live_51Rs8MIRtqfbMHY0yb8V2ysZ9lZkVfTjeT0bEAWtbUhFgotYgchlIWeK7kAHtshrKo2kofsMi62ZlHPm7TOh8Lgup00I3G1FLa3");
    await stripe.redirectToCheckout({
      lineItems: [{ price: "price_1RsA06RtqfbMHY0y4ru9hffZ", quantity: 1 }],
      mode: "subscription",
      successUrl: window.location.origin + "/dashboard?subscribed=true",
      cancelUrl: window.location.origin + "/pricing",
    });
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Homi Premium</h2>
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">$5/month</h3>
          <p className="mb-4">Unlock full access to our AI assistant, document downloads, and priority listings.</p>
          <Button onClick={handleSubscribe}>Subscribe with Stripe</Button>
        </CardContent>
      </Card>
    </div>
  );
}

function Dashboard({ isSubscribed }) {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      {!isSubscribed ? (
        <div className="bg-yellow-100 p-4 rounded mb-6">
          <p className="text-yellow-800">Subscribe for $5/month to unlock AI assistant and full document access.</p>
          <Link to="/pricing">
            <Button className="mt-4">Upgrade Now</Button>
          </Link>
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-semibold">Welcome, Premium User!</h3>
          <p className="mt-2">You now have full access to listings, documents, and the Homi AI assistant.</p>
          <AIChatAssistant />
          <DocumentLibrary />
        </div>
      )}
    </div>
  );
}

function AIChatAssistant() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    setLoading(true);
    const res = await fetch("/api/ai-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    setResponse(data.reply || "No response");
    setLoading(false);
  };

  return (
    <div className="mt-6 border p-4 rounded shadow">
      <h4 className="text-lg font-bold mb-2">Homi AI Assistant</h4>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask me anything..."
        className="w-full border p-2 rounded mb-2"
      />
      <Button onClick={handleAsk} disabled={loading}>{loading ? "Thinking..." : "Send"}</Button>
      {response && <p className="mt-4 bg-gray-100 p-2 rounded">{response}</p>}
    </div>
  );
}

function DocumentLibrary() {
  return (
    <div className="mt-6">
      <h4 className="text-lg font-bold mb-2">Document Library</h4>
      <ul className="list-disc list-inside">
        <li><a href="#" className="text-blue-600 underline">Buyer Agreement.pdf</a></li>
        <li><a href="#" className="text-blue-600 underline">Disclosure Form.pdf</a></li>
        <li><a href="#" className="text-blue-600 underline">Inspection Checklist.pdf</a></li>
      </ul>
    </div>
  );
}