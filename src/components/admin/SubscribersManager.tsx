import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const SubscribersManager = () => {
  const [subscribers, setSubscribers] = useState([]);

  const fetchSubscribers = async () => {
    const { data, error } = await supabase
      .from('subscribers')
      .select('*');
    if (error) {
      console.error('Error fetching subscribers:', error);
      return;
    }
    setSubscribers(data || []);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manage Subscribers</h2>
      <div className="space-y-4">
        {subscribers.map((subscriber: any) => (
          <div key={subscriber.id} className="p-4 border rounded">
            <p>{subscriber.email}</p>
            <p className="text-sm text-gray-600">
              Status: {subscriber.is_verified ? 'Verified' : 'Unverified'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};