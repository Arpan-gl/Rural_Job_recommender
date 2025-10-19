import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button'; // shadcn/ui Button
import { Separator } from '../components/ui/separator'; // shadcn/ui Separator
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'; // shadcn/ui Card
import { Settings, LayoutDashboard, LogOut, UserPlus } from 'lucide-react'; // lucide-react icons

// Define the available pages for the profile view
type ProfileView = 'dashboard' | 'settings' | 'addDetails';


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

const AddDetailsContent: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Add/Update Details</CardTitle>
      <CardDescription>Fill out your public profile information.</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          <span className='font-semibold'>Placeholder:</span> This is where your form for updating fields like Name, Bio, Location, and Profile Picture would go.
        </p>
        {/* Placeholder for an actual form */}
        <Button>Save Details</Button>
      </div>
    </CardContent>
  </Card>
);

// --- The Main Profile Page Component ---

export const ProfilePage: React.FC = () => {
  const [currentView, setCurrentView] = useState<ProfileView>('settings');
  const navigate = useNavigate();

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
        {currentView === 'addDetails' && <AddDetailsContent />}
      </div>
      
    </div>
  );
};