'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Edit, LinkIcon, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingLinks, setIsEditingLinks] = useState(false);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/signin');
    return null;
  }

  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setIsEditingLinks(false);
  };

  const handleEditLinks = () => {
    setIsEditingLinks(true);
    setIsEditingProfile(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <Button onClick={handleEditProfile} variant="outline"><Edit className="mr-2 h-4 w-4" /> Edit Profile</Button>
            <Button onClick={handleEditLinks} variant="outline"><LinkIcon className="mr-2 h-4 w-4" /> Edit Links</Button>
          </div>
          <div>
            <Badge className="bg-gray-700 text-gray-300">{session?.user?.name}</Badge>
          </div>
        </div>

        <div className="flex items-center space-x-4 mt-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={session?.user?.image || '/placeholder.svg'} alt={session?.user?.name || 'User'} />
            <AvatarFallback>{session?.user?.name?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl">{session?.user?.name}</h2>
            <p className="text-gray-400">{session?.user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
