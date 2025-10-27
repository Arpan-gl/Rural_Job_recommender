import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button'; // shadcn/ui Button
import { Separator } from '../components/ui/separator'; // shadcn/ui Separator
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'; // shadcn/ui Card
import { Badge } from '../components/ui/badge';
import { Settings, LayoutDashboard, LogOut, UserPlus, Award } from 'lucide-react'; // lucide-react icons
import axios from '../../axios';

// Define the available pages for the profile view
type ProfileView = 'dashboard' | 'settings' | 'addDetails';

interface UserSkills {
  skills: string[];
  preferred_roles: string[];
  experience_years?: number;
  location?: string;
}


const SettingsContent: React.FC<{ setView: (view: ProfileView) => void }> = ({ setView }) => (
  <Card>
    <CardHeader>
      <CardTitle>General Settings</CardTitle>
      <CardDescription>Manage your account preferences.</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-2 border rounded-md">
            <span>Update Personal Information</span>
            {/* 🔗 Add Detail Link as a Button within Settings content */}
            <Button variant="outline" onClick={() => setView('addDetails')}>
                <UserPlus className="mr-2 h-4 w-4" /> 
                Add Details
            </Button>
        </div>
        <div className="p-2 border rounded-md">
            Security: Change Password, Enable 2FA...
        </div>
      </div>
    </CardContent>
  </Card>
);

const AddDetailsContent: React.FC<{ skills: UserSkills | null }> = ({ skills }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await axios.get('/user/skills');
      if (response.data.success) {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Skills & Profile</CardTitle>
        <CardDescription>View your skills and profile information.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : skills ? (
            <>
              {skills.skills && skills.skills.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Your Skills</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {skills.preferred_roles && skills.preferred_roles.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Preferred Roles</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.preferred_roles.map((role, index) => (
                      <Badge key={index} variant="outline" className="px-3 py-1">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                {skills.experience_years && (
                  <div>
                    <p className="text-sm text-muted-foreground">Experience</p>
                    <p className="font-medium">{skills.experience_years} years</p>
                  </div>
                )}
                {skills.location && (
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{skills.location}</p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">
                  Update your skills by visiting the Skills page
                </p>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              No skills data available yet. Please add your skills to get started.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// --- The Main Profile Page Component ---

export const ProfilePage: React.FC = () => {
  const [currentView, setCurrentView] = useState<ProfileView>('settings');
  const [skills, setSkills] = useState<UserSkills | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserSkills();
  }, []);

  const fetchUserSkills = async () => {
    try {
      const response = await axios.get('/user/skills');
      if (response.data.success) {
        setSkills(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching user skills:", error);
    }
  };

  const handleSignOut = () => {
    // Navigate to the app's sign out route
    navigate('/signout');
  };

  return (
    <div className="flex space-x-8 max-w-6xl mx-auto border rounded-lg bg-white shadow-lg p-6">
      
      {/* 1. Left Sidebar Navigation */}
      <div className="w-64 space-y-4 pr-6 border-r">
        
        {/* Project Tag */}
        <h2 className="text-lg font-bold text-primary mb-6 border-b pb-2">
            PROJECT
        </h2>
        
        {/* Dashboard Button (navigates to app Dashboard route) */}
        <Button
          variant={currentView === 'dashboard' ? 'secondary' : 'ghost'}
          className="w-full justify-start"
          onClick={() => navigate('/dashboard')}
        >
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Dashboard
        </Button>

        {/* Setting Button */}
        <div className="space-y-1">
            <Button
              variant={currentView === 'settings' || currentView === 'addDetails' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setCurrentView('settings')}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            
            {/* 🔗 Add Detail Link (Nested under Settings) */}
            <Button
              variant={currentView === 'addDetails' ? 'default' : 'ghost'}
              className="w-full justify-start pl-8 text-sm text-muted-foreground"
              onClick={() => setCurrentView('addDetails')}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add Details
            </Button>
        </div>


        <Separator className="my-4" />

        {/* 🚪 Sign Out Button */}
        <Button
          variant="destructive"
          className="w-full justify-start mt-8"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
      
      {/* 2. Right Content Area */}
      <div className="flex-1 min-h-[500px]">
        {currentView === 'settings' && <SettingsContent setView={setCurrentView} />}
        {currentView === 'addDetails' && <AddDetailsContent skills={skills} />}
      </div>
      
    </div>
  );
};