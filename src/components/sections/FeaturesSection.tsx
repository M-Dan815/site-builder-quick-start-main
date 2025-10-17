
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, Target } from "lucide-react";

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 px-4 bg-gray-800/50">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl font-bold text-center mb-12">Why Choose Our Database?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <Users className="h-12 w-12 text-blue-400 mb-4" />
              <CardTitle className="text-white">Comprehensive Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Extensive database of developers with various skills: Java, Python, JavaScript, Ruby, C++, and more across multiple industries.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <Clock className="h-12 w-12 text-green-400 mb-4" />
              <CardTitle className="text-white">Always Up-to-Date</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Automatically updated from GitHub profiles, ensuring you always have the most current developer information and contact details.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <Target className="h-12 w-12 text-purple-400 mb-4" />
              <CardTitle className="text-white">Direct Access</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Contact developers directly with verified contact information, increasing your chances of finding the best candidates quickly.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
