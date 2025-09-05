import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContactInfo from "@/components/profile/ContactInfo";
import Portfolio from "@/components/profile/Portfolio";
import MyJourney from "@/components/profile/MyJourney";
import SkillsTechnologies from "@/components/profile/SkillsTechnologies";
import ContinuousLearning from "@/components/profile/ContinuousLearning";
import GitHubResume from "@/components/profile/GitHubResume";
import ClientTestimonials from "@/components/profile/ClientTestimonials";
import QuickContact from "@/components/profile/QuickContact";
import Footer from "@/components/profile/Footer";

const Profile = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="mb-8">
            <img 
              src="/placeholder.svg" 
              alt="Profile" 
              className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-primary/20 shadow-lg"
            />
            <h1 className="text-4xl font-bold text-foreground mb-4">John Developer</h1>
            <p className="text-xl text-muted-foreground mb-6">Full-Stack Developer & Tech Innovator</p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                React Expert
              </span>
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                Node.js Specialist
              </span>
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                Mobile Developer
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <MyJourney />
                <GitHubResume />
              </div>
              <div className="space-y-8">
                <ContactInfo />
                <QuickContact />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="portfolio">
            <Portfolio />
          </TabsContent>

          <TabsContent value="skills" className="space-y-8">
            <SkillsTechnologies />
            <ContinuousLearning />
          </TabsContent>

          <TabsContent value="testimonials">
            <ClientTestimonials />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;