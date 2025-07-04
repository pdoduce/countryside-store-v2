"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type AdminUser = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  billing_address: string | null;
  created_at: string | null;
};

export default function AdminUsersPage() {
  const supabase = createClient();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("admin_user_list")
        .select("*");

      if (error) {
        console.error("Error fetching users:", error.message);
      } else {
        setUsers(data || []);
      }

      setLoading(false);
    };

    fetchUsers();
  }, [supabase]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="grid gap-4">
          {users.map((user) => (
            <Card key={user.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">
                  {user.full_name || "Unnamed User"}
                </p>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-sm">Phone: {user.phone || "N/A"}</p>
                <p className="text-sm">Billing: {user.billing_address || "N/A"}</p>
                <p className="text-xs text-gray-400">
                  Joined:{" "}
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>
              <div className="flex gap-2">
                {/* You can later add edit/delete buttons */}
                <Button variant="outline" size="sm" disabled>
                  Edit
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
