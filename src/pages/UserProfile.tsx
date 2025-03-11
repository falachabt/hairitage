
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const UserProfile = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    country: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    } else if (user) {
      fetchProfile();
    }
  }, [user, loading, navigate]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setFetchError(null);
      
      // Use the REST API approach to fetch profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        setFetchError('Erreur lors du chargement du profil. Veuillez réessayer plus tard.');
        toast({
          title: 'Erreur',
          description: 'Impossible de charger votre profil. Veuillez réessayer plus tard.',
          variant: 'destructive',
        });
        return;
      }

      if (data) {
        setProfile({
          full_name: data.full_name || '',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          postal_code: data.postal_code || '',
          country: data.country || '',
        });
      } else {
        // If profile doesn't exist, create it
        await createProfile();
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      setFetchError('Erreur lors du chargement du profil. Veuillez réessayer plus tard.');
      toast({
        title: 'Erreur',
        description: 'Impossible de charger votre profil. Veuillez réessayer plus tard.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const createProfile = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata.full_name || '',
        });
      
      if (error) {
        console.error('Error creating profile:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de créer votre profil. Veuillez réessayer plus tard.',
          variant: 'destructive',
        });
        return;
      }
      
      // Set initial profile state
      setProfile({
        full_name: user.user_metadata.full_name || '',
        phone: '',
        address: '',
        city: '',
        postal_code: '',
        country: '',
      });
      
    } catch (error) {
      console.error('Error in createProfile:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          address: profile.address,
          city: profile.city,
          postal_code: profile.postal_code,
          country: profile.country,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de mettre à jour votre profil. Veuillez réessayer plus tard.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Profil mis à jour',
        description: 'Vos informations ont été mises à jour avec succès.',
      });
      
      // Update local storage for checkout
      localStorage.setItem('userProfile', JSON.stringify({
        ...profile,
        id: user.id,
        email: user.email
      }));
      
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour votre profil. Veuillez réessayer plus tard.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container py-8 flex items-center justify-center">
          <p>Chargement...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Mon Profil</h1>
          
          {fetchError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <p>{fetchError}</p>
              <Button 
                variant="outline" 
                className="mt-2" 
                onClick={fetchProfile}
                disabled={isLoading}
              >
                Réessayer
              </Button>
            </div>
          )}
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>Mettez à jour vos informations personnelles</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Nom complet</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={profile.full_name}
                      onChange={handleChange}
                      placeholder="Votre nom complet"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      placeholder="Votre numéro de téléphone"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input
                      id="address"
                      name="address"
                      value={profile.address}
                      onChange={handleChange}
                      placeholder="Votre adresse"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      name="city"
                      value={profile.city}
                      onChange={handleChange}
                      placeholder="Votre ville"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postal_code">Code postal</Label>
                    <Input
                      id="postal_code"
                      name="postal_code"
                      value={profile.postal_code}
                      onChange={handleChange}
                      placeholder="Votre code postal"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Pays</Label>
                    <Input
                      id="country"
                      name="country"
                      value={profile.country}
                      onChange={handleChange}
                      placeholder="Votre pays"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Sauvegarde en cours...' : 'Sauvegarder les modifications'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Compte</CardTitle>
              <CardDescription>Gérez les paramètres de votre compte</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Email: {user?.email}</p>
              <div className="flex justify-end">
                <Button variant="destructive" onClick={signOut}>
                  Se déconnecter
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfile;
