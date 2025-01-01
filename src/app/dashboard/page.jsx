'use client';

import { useState, useEffect } from 'react';
import { Edit, LinkIcon, Github, Twitter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { toast } = useToast();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingLinks, setIsEditingLinks] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [links, setLinks] = useState([
    { title: "Default Link", url: "https://example.com", icon: Github },
    { title: "Default Twitter", url: "https://twitter.com", icon: Twitter },
  ]);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setName(session.user.name || '');
      setBio(session.user.bio || '');
      setLinks(session.user.links || []);
    }
  }, [session, status]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
      
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

  const handleSaveProfile = async () => {
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsEditingProfile(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleSaveLinks = async () => {
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsEditingLinks(false);
    toast({
      title: "Links updated",
      description: "Your links have been successfully updated.",
    });
  };

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setLinks(newLinks);
  };

  return (
    <div className="min-h-screen bg-orange-50 text-gray-800 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <Card className="bg-white border-orange-200 shadow-lg">
          <CardHeader className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <Avatar className="h-24 w-24 border-4 border-orange-400">
                <AvatarImage src={session?.user.image} alt={session?.user.name} />
                <AvatarFallback className="bg-orange-100 text-orange-600 text-2xl font-bold">
                  {name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-3xl font-bold text-orange-600">{session?.user.name}</CardTitle>
                <p className="text-gray-600">{session?.user.email}</p>
              </div>
            </div>
            <Badge className="bg-orange-100 text-orange-600 px-3 py-1 text-sm font-semibold">
              Power Level: 9000+
            </Badge>
          </CardHeader>
          <CardContent>
            {isEditingProfile ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-orange-600">Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <Label htmlFor="bio" className="text-orange-600">Bio</Label>
                  <Textarea 
                    id="bio" 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)} 
                    className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                  />
                </div>
                <Button onClick={handleSaveProfile} className="bg-orange-500 hover:bg-orange-600 text-white">Save Profile</Button>
              </div>
            ) : (
              <div>
                <p className="text-gray-700 mb-4">{bio}</p>
                <Button onClick={handleEditProfile} variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-100">
                  <Edit className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white border-orange-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-orange-600">Power Links</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditingLinks ? (
              <div className="space-y-4">
                {links.map((link, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input 
                      value={link.title} 
                      onChange={(e) => handleLinkChange(index, 'title', e.target.value)}
                      className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                    />
                    <Input 
                      value={link.url} 
                      onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                      className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                    />
                  </div>
                ))}
                <Button onClick={handleSaveLinks} className="bg-orange-500 hover:bg-orange-600 text-white">Save Links</Button>
              </div>
            ) : (
              <div>
                <div className="space-y-2 mb-4">
                  {links.map((link, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <link.icon className="h-5 w-5 text-orange-500" />
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">
                        {link.title}
                      </a>
                    </div>
                  ))}
                </div>
                <Button onClick={handleEditLinks} variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-100">
                  <LinkIcon className="mr-2 h-4 w-4" /> Edit Power Links
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
