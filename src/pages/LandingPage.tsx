import { 
  ArrowRight, 
  Users, 
  Briefcase, 
  ClipboardCheck, 
  BarChart3,
  CheckCircle,
  Star,
  UserPlus,
  Award,
} from 'lucide-react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      <header className="bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 bg-gradient-to-br from-[#2d6a4f] via-[#82D173] to-[#ABFAA9] rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
                <UserPlus className="w-8 h-8 text-white drop-shadow-lg" />
              </div>
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-[#00241B] to-[#1b4332] bg-clip-text text-transparent">
                  TalentFlow
                </h1>
                <p className="text-sm text-[#2d6a4f] font-semibold">Professional Hiring Platform</p>
              </div>
            </div>
            <a
              href="/dashboard"
              className="relative overflow-hidden bg-gradient-to-r from-[#2d6a4f] to-[#82D173] text-white px-10 py-4 rounded-2xl font-bold hover:shadow-2xl transition-all transform hover:scale-105 group"
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#1b4332] to-[#2d6a4f] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
          </div>
        </div>
      </header>

 
      <section className="relative overflow-hidden bg-gradient-to-br from-[#00241B] via-[#1b4332] to-[#2d6a4f] text-white py-32">

        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-[#82D173] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#ABFAA9] rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">

            
            <h2 className="text-6xl font-black mb-6 leading-tight">
              Transform Your <br/>
              <span className="bg-gradient-to-r from-[#82D173] via-[#ABFAA9] to-[#93E5AB] bg-clip-text text-transparent">
                Talent Acquisition
              </span>
            </h2>
            
            <p className="text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              The most advanced hiring platform for modern teams. Streamline candidate management, 
              create intelligent assessments, and make data-driven hiring decisions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Link
                to="/dashboard"
                className="group relative bg-gradient-to-r from-[#82D173] to-[#ABFAA9] text-[#00241B] px-12 py-6 rounded-2xl font-bold text-xl hover:shadow-3xl transition-all transform hover:scale-110 flex items-center justify-center space-x-3 overflow-hidden"
              >
                <span className="relative z-10">Start Hiring Today</span>
                <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform" />
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </Link>
              
            </div>
            

            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
              {[
                { value: '50%', label: 'Faster Hiring' },
                { value: '10K+', label: 'Companies' },
                { value: '98%', label: 'Satisfaction' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-4xl font-bold text-[#ABFAA9]">{stat.value}</p>
                  <p className="text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#2d6a4f] font-bold text-sm uppercase tracking-wider">Features</span>
            <h3 className="text-5xl font-black text-[#00241B] mb-4 mt-2">
              Everything You Need to <span className="text-[#2d6a4f]">Hire Better</span>
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to help you find, assess, and hire the best candidates efficiently.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Briefcase,
                title: 'Job Management',
                description: 'Create, post, and manage job openings with ease. Track applications and manage your hiring pipeline.',
                color: 'from-[#2d6a4f] to-[#82D173]'
              },
              {
                icon: Users,
                title: 'Candidate Tracking',
                description: 'Organize and track candidates through every stage of your hiring process with detailed profiles.',
                color: 'from-[#82D173] to-[#ABFAA9]'
              },
              {
                icon: ClipboardCheck,
                title: 'Custom Assessments',
                description: 'Build tailored assessments to evaluate candidates skills and cultural fit effectively.',
                color: 'from-[#1b4332] to-[#2d6a4f]'
              },
              {
                icon: BarChart3,
                title: 'Analytics & Insights',
                description: 'Get detailed insights into your hiring metrics and make data-driven decisions.',
                color: 'from-[#ABFAA9] to-[#93E5AB]'
              }
            ].map((feature, index) => (
              <div key={index} className="group relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#ABFAA9]/20 to-transparent rounded-full blur-2xl"></div>
                
                <div className={`relative w-14 h-14 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                
                <h4 className="text-2xl font-bold text-[#00241B] mb-3">{feature.title}</h4>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-4xl font-bold text-[#00241B] mb-6">
                Why Choose TalentFlow?
              </h3>
              <div className="space-y-4">
                {[
                  'Reduce time-to-hire by 60% with streamlined workflows',
                  'Improve candidate quality with data-driven assessments',
                  'Collaborate seamlessly with your hiring team',
                  'Scale your hiring process as your company grows',
                  'Integrate with your existing HR tools and systems'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-[#82D173]" />
                    <span className="text-lg text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#ABFAA9] to-[#82D173] p-8 rounded-2xl">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2 mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">5.0 rating</span>
                </div>
                <p className="text-gray-700 mb-4">
                  "TalentFlow transformed our hiring process. We've reduced our time-to-hire by 50% 
                  and significantly improved candidate quality."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#82D173] rounded-full flex items-center justify-center">
                    <span className="text-[#00241B] font-semibold text-sm">SJ</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#00241B]">Ujjwal Thakur</p>
                    <p className="text-sm text-gray-600">Head of Talent</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="bg-gradient-to-r from-white via-gray-50 to-white py-24">
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#ABFAA9]/10 via-transparent to-[#82D173]/10 rounded-3xl blur-3xl"></div>
          
          <div className="relative bg-gradient-to-br from-[#00241B] to-[#1b4332] rounded-3xl p-16 shadow-2xl">
            <Award className="w-16 h-16 text-[#82D173] mx-auto mb-6" />
            <h3 className="text-5xl font-black text-white mb-6">
              Ready to Transform Your Hiring?
            </h3>
            <p className="text-2xl text-[#ABFAA9] mb-10 max-w-3xl mx-auto">
              Join thousands of companies using TalentFlow to build amazing teams.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-[#82D173] to-[#ABFAA9] text-[#00241B] px-12 py-6 rounded-2xl font-bold text-xl hover:shadow-3xl transition-all transform hover:scale-110 group"
            >
              <span>Start Now</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
            
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
