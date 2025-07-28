'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, TrendingUp, Users, Lightbulb, Target, BookOpen, BarChart3, Globe, Zap, Heart, Shield, RefreshCw } from 'lucide-react';

interface Example {
  id: string;
  title: string;
  description: string;
  prompt: string;
  icon: React.ElementType;
  category: string;
  style: string;
  cardCount: number;
}

const presentationExamples: Example[] = [
  // Business & Entrepreneurship (20)
  { id: 'biz-1', title: 'Startup Pitch Deck', description: 'Perfect for raising your first round', prompt: 'Create a compelling startup pitch deck for a new SaaS product targeting small businesses', icon: TrendingUp, category: 'Business', style: 'professional', cardCount: 10 },
  { id: 'biz-2', title: 'Quarterly Business Review', description: 'Showcase your team\'s achievements', prompt: 'Present our Q3 business performance with key metrics, wins, and strategic initiatives', icon: BarChart3, category: 'Business', style: 'corporate', cardCount: 12 },
  { id: 'biz-3', title: 'Product Launch Strategy', description: 'Go-to-market plan for new products', prompt: 'Outline our product launch strategy for a new mobile app targeting Gen Z users', icon: Zap, category: 'Business', style: 'creative', cardCount: 15 },
  { id: 'biz-4', title: 'Sales Team Training', description: 'Onboard new sales representatives', prompt: 'Create training materials for new sales hires covering our product features and sales process', icon: Users, category: 'Business', style: 'professional', cardCount: 8 },
  { id: 'biz-5', title: 'Investor Update', description: 'Monthly progress report for investors', prompt: 'Present our monthly investor update with key metrics, milestones, and upcoming priorities', icon: TrendingUp, category: 'Business', style: 'corporate', cardCount: 6 },
  { id: 'biz-6', title: 'Market Analysis Report', description: 'Deep dive into market opportunities', prompt: 'Analyze the competitive landscape for AI-powered customer service solutions', icon: Globe, category: 'Business', style: 'professional', cardCount: 14 },
  { id: 'biz-7', title: 'Customer Success Stories', description: 'Showcase client achievements', prompt: 'Present customer success stories and testimonials from our enterprise clients', icon: Heart, category: 'Business', style: 'modern', cardCount: 9 },
  { id: 'biz-8', title: 'Budget Planning 2024', description: 'Financial planning and forecasting', prompt: 'Create our 2024 budget presentation with department allocations and ROI projections', icon: BarChart3, category: 'Business', style: 'corporate', cardCount: 11 },
  { id: 'biz-9', title: 'Team Building Workshop', description: 'Engage and motivate your team', prompt: 'Design an interactive team building presentation for remote employees', icon: Users, category: 'Business', style: 'playful', cardCount: 7 },
  { id: 'biz-10', title: 'Digital Transformation', description: 'Lead change in your organization', prompt: 'Present our digital transformation roadmap for the next 18 months', icon: Zap, category: 'Business', style: 'modern', cardCount: 13 },
  { id: 'biz-11', title: 'Risk Management Plan', description: 'Identify and mitigate business risks', prompt: 'Outline our risk management framework for cybersecurity threats', icon: Target, category: 'Business', style: 'professional', cardCount: 10 },
  { id: 'biz-12', title: 'Partnership Proposal', description: 'Win new business partnerships', prompt: 'Create a partnership proposal for strategic alliances with tech companies', icon: Globe, category: 'Business', style: 'elegant', cardCount: 8 },
  { id: 'biz-13', title: 'Employee Onboarding', description: 'Welcome new team members', prompt: 'Design an engaging onboarding presentation for new software engineers', icon: Users, category: 'Business', style: 'modern', cardCount: 12 },
  { id: 'biz-14', title: 'Brand Strategy Refresh', description: 'Reposition your brand in the market', prompt: 'Present our brand strategy refresh to better connect with millennials', icon: Lightbulb, category: 'Business', style: 'creative', cardCount: 9 },
  { id: 'biz-15', title: 'Sustainability Report', description: 'Showcase environmental initiatives', prompt: 'Create our annual sustainability report highlighting green initiatives and carbon reduction', icon: Globe, category: 'Business', style: 'minimalist', cardCount: 10 },
  { id: 'biz-16', title: 'Remote Work Policy', description: 'Guidelines for distributed teams', prompt: 'Present our remote work policy and best practices for hybrid teams', icon: Users, category: 'Business', style: 'professional', cardCount: 7 },
  { id: 'biz-17', title: 'Customer Retention Strategy', description: 'Keep your customers coming back', prompt: 'Outline our customer retention strategy and loyalty program initiatives', icon: Heart, category: 'Business', style: 'modern', cardCount: 11 },
  { id: 'biz-18', title: 'Product Roadmap Q1-Q2', description: 'Feature planning and timeline', prompt: 'Present our product roadmap for Q1-Q2 2024 with key features and milestones', icon: Target, category: 'Business', style: 'creative', cardCount: 13 },
  { id: 'biz-19', title: 'Competitive Analysis', description: 'Know your market position', prompt: 'Analyze our top 5 competitors and present strategic recommendations', icon: BarChart3, category: 'Business', style: 'corporate', cardCount: 10 },
  { id: 'biz-20', title: 'Annual Company Meeting', description: 'State of the company address', prompt: 'Create our annual company meeting presentation highlighting achievements and future vision', icon: TrendingUp, category: 'Business', style: 'corporate', cardCount: 15 },

  // Education & Learning (15)
  { id: 'edu-1', title: 'History of Ancient Rome', description: 'Engaging historical overview', prompt: 'Create an educational presentation about the rise and fall of the Roman Empire', icon: BookOpen, category: 'Education', style: 'classic', cardCount: 12 },
  { id: 'edu-2', title: 'Climate Change Science', description: 'Evidence-based environmental science', prompt: 'Present the science behind climate change and its global impacts', icon: Globe, category: 'Education', style: 'modern', cardCount: 14 },
  { id: 'edu-3', title: 'Introduction to AI', description: 'Demystify artificial intelligence', prompt: 'Explain artificial intelligence concepts for beginners with real-world examples', icon: Zap, category: 'Education', style: 'creative', cardCount: 10 },
  { id: 'edu-4', title: 'World War II Timeline', description: 'Key events and turning points', prompt: 'Create a comprehensive timeline of World War II major events and battles', icon: BookOpen, category: 'Education', style: 'classic', cardCount: 11 },
  { id: 'edu-5', title: 'Renewable Energy Sources', description: 'Solar, wind, and hydro power', prompt: 'Present different types of renewable energy and their environmental benefits', icon: Globe, category: 'Education', style: 'modern', cardCount: 9 },
  { id: 'edu-6', title: 'Human Anatomy Basics', description: 'Body systems overview', prompt: 'Create an introductory presentation on human anatomy and body systems', icon: Heart, category: 'Education', style: 'professional', cardCount: 13 },
  { id: 'edu-7', title: 'Space Exploration History', description: 'From Apollo to Artemis', prompt: 'Present the history of space exploration from the moon landing to current missions', icon: Globe, category: 'Education', style: 'creative', cardCount: 12 },
  { id: 'edu-8', title: 'Financial Literacy 101', description: 'Personal finance basics', prompt: 'Teach high school students the basics of budgeting, saving, and investing', icon: BarChart3, category: 'Education', style: 'modern', cardCount: 8 },
  { id: 'edu-9', title: 'Ocean Conservation', description: 'Protecting marine ecosystems', prompt: 'Create awareness about ocean conservation and marine biodiversity', icon: Globe, category: 'Education', style: 'creative', cardCount: 10 },
  { id: 'edu-10', title: 'Coding Fundamentals', description: 'Programming concepts for beginners', prompt: 'Introduce basic programming concepts using Python for absolute beginners', icon: Zap, category: 'Education', style: 'modern', cardCount: 11 },
  { id: 'edu-11', title: 'Nutrition and Health', description: 'Healthy eating habits', prompt: 'Present evidence-based nutrition guidelines for maintaining optimal health', icon: Heart, category: 'Education', style: 'professional', cardCount: 9 },
  { id: 'edu-12', title: 'Shakespeare\'s Masterpieces', description: 'Literary analysis and themes', prompt: 'Analyze the major themes and techniques in Shakespeare\'s most famous plays', icon: BookOpen, category: 'Education', style: 'classic', cardCount: 10 },
  { id: 'edu-13', title: 'Photography Basics', description: 'Camera settings and composition', prompt: 'Teach photography fundamentals including aperture, shutter speed, and composition rules', icon: Lightbulb, category: 'Education', style: 'creative', cardCount: 8 },
  { id: 'edu-14', title: 'Mental Health Awareness', description: 'Understanding psychological wellbeing', prompt: 'Create awareness about mental health, common disorders, and support resources', icon: Heart, category: 'Education', style: 'modern', cardCount: 12 },
  { id: 'edu-15', title: 'Sustainable Living', description: 'Eco-friendly lifestyle choices', prompt: 'Present practical ways individuals can live more sustainably and reduce their carbon footprint', icon: Globe, category: 'Education', style: 'minimalist', cardCount: 9 },

  // Marketing & Sales (15)
  { id: 'mkt-1', title: 'Social Media Strategy', description: 'Build your online presence', prompt: 'Create a comprehensive social media marketing strategy for a fashion brand', icon: TrendingUp, category: 'Marketing', style: 'creative', cardCount: 13 },
  { id: 'mkt-2', title: 'Email Marketing Campaign', description: 'Convert subscribers to customers', prompt: 'Design an email marketing campaign for an e-commerce store\'s summer sale', icon: Target, category: 'Marketing', style: 'modern', cardCount: 8 },
  { id: 'mkt-3', title: 'Content Marketing Plan', description: 'Attract and engage your audience', prompt: 'Develop a 6-month content marketing plan for a B2B software company', icon: Lightbulb, category: 'Marketing', style: 'professional', cardCount: 11 },
  { id: 'mkt-4', title: 'SEO Best Practices', description: 'Rank higher in search results', prompt: 'Present SEO strategies and best practices for a local restaurant website', icon: TrendingUp, category: 'Marketing', style: 'professional', cardCount: 10 },
  { id: 'mkt-5', title: 'Brand Storytelling', description: 'Connect emotionally with customers', prompt: 'Create a brand storytelling presentation for a sustainable fashion startup', icon: Heart, category: 'Marketing', style: 'creative', cardCount: 9 },
  { id: 'mkt-6', title: 'Influencer Partnership', description: 'Collaborate with content creators', prompt: 'Outline an influencer marketing strategy for a beauty product launch', icon: Users, category: 'Marketing', style: 'modern', cardCount: 7 },
  { id: 'mkt-7', title: 'Customer Journey Mapping', description: 'Understand your buyers', prompt: 'Map the customer journey for an online education platform', icon: Target, category: 'Marketing', style: 'modern', cardCount: 12 },
  { id: 'mkt-8', title: 'Marketing ROI Analysis', description: 'Measure campaign effectiveness', prompt: 'Present marketing ROI analysis and optimization strategies for Q3 campaigns', icon: BarChart3, category: 'Marketing', style: 'corporate', cardCount: 10 },
  { id: 'mkt-9', title: 'Product Positioning', description: 'Stand out from competitors', prompt: 'Develop product positioning strategy for a new fitness tracking app', icon: Lightbulb, category: 'Marketing', style: 'creative', cardCount: 8 },
  { id: 'mkt-10', title: 'Video Marketing Strategy', description: 'Engage with visual content', prompt: 'Create a video marketing strategy for a travel agency\'s YouTube channel', icon: Zap, category: 'Marketing', style: 'creative', cardCount: 11 },
  { id: 'mkt-11', title: 'Lead Generation Campaign', description: 'Capture qualified prospects', prompt: 'Design a lead generation campaign for a software consulting company', icon: Target, category: 'Marketing', style: 'professional', cardCount: 9 },
  { id: 'mkt-12', title: 'Customer Testimonials', description: 'Social proof that sells', prompt: 'Create a presentation showcasing customer testimonials and case studies', icon: Heart, category: 'Marketing', style: 'modern', cardCount: 7 },
  { id: 'mkt-13', title: 'Event Marketing Plan', description: 'Promote your next big event', prompt: 'Develop an event marketing plan for a tech conference with 500+ attendees', icon: Users, category: 'Marketing', style: 'creative', cardCount: 12 },
  { id: 'mkt-14', title: 'Pricing Strategy', description: 'Optimize for profit and growth', prompt: 'Present pricing strategy analysis for a subscription-based software service', icon: BarChart3, category: 'Marketing', style: 'corporate', cardCount: 10 },
  { id: 'mkt-15', title: 'Competitive Analysis', description: 'Know your market position', prompt: 'Analyze competitor marketing strategies and present differentiation opportunities', icon: Globe, category: 'Marketing', style: 'professional', cardCount: 11 },

  // Technology & Innovation (15)
  { id: 'tech-1', title: 'AI Implementation Roadmap', description: 'Integrate AI into your business', prompt: 'Create an AI implementation roadmap for a retail company', icon: Zap, category: 'Technology', style: 'modern', cardCount: 14 },
  { id: 'tech-2', title: 'Blockchain Explained', description: 'Demystify cryptocurrency technology', prompt: 'Explain blockchain technology and its applications beyond cryptocurrency', icon: Globe, category: 'Technology', style: 'creative', cardCount: 10 },
  { id: 'tech-3', title: 'Cloud Migration Strategy', description: 'Move to the cloud seamlessly', prompt: 'Present a cloud migration strategy for a traditional enterprise company', icon: Zap, category: 'Technology', style: 'professional', cardCount: 12 },
  { id: 'tech-4', title: 'Cybersecurity Best Practices', description: 'Protect your digital assets', prompt: 'Create cybersecurity awareness training for employees', icon: Shield, category: 'Technology', style: 'professional', cardCount: 11 },
  { id: 'tech-5', title: 'IoT Applications', description: 'Internet of Things use cases', prompt: 'Explore IoT applications in smart city development', icon: Globe, category: 'Technology', style: 'modern', cardCount: 9 },
  { id: 'tech-6', title: 'Data Analytics Insights', description: 'Turn data into decisions', prompt: 'Present data analytics insights and actionable recommendations for e-commerce', icon: BarChart3, category: 'Technology', style: 'modern', cardCount: 13 },
  { id: 'tech-7', title: 'Mobile App Development', description: 'From idea to app store', prompt: 'Outline the mobile app development process for a fitness tracking application', icon: Zap, category: 'Technology', style: 'creative', cardCount: 12 },
  { id: 'tech-8', title: 'VR/AR Applications', description: 'Immersive technology experiences', prompt: 'Explore virtual and augmented reality applications in education', icon: Globe, category: 'Technology', style: 'creative', cardCount: 10 },
  { id: 'tech-9', title: 'Tech Stack Comparison', description: 'Choose the right tools', prompt: 'Compare different technology stacks for building scalable web applications', icon: BarChart3, category: 'Technology', style: 'professional', cardCount: 11 },
  { id: 'tech-10', title: 'Agile Development Process', description: 'Modern software development', prompt: 'Present the agile development methodology for software teams', icon: Target, category: 'Technology', style: 'modern', cardCount: 9 },
  { id: 'tech-11', title: 'Machine Learning Basics', description: 'AI for beginners', prompt: 'Introduce machine learning concepts with practical examples', icon: Zap, category: 'Technology', style: 'creative', cardCount: 12 },
  { id: 'tech-12', title: 'Digital Transformation', description: 'Technology-driven change', prompt: 'Create a digital transformation presentation for a traditional business', icon: TrendingUp, category: 'Technology', style: 'modern', cardCount: 14 },
  { id: 'tech-13', title: '5G Technology Impact', description: 'Next-generation connectivity', prompt: 'Explain 5G technology and its impact on various industries', icon: Globe, category: 'Technology', style: 'modern', cardCount: 10 },
  { id: 'tech-14', title: 'Quantum Computing', description: 'The future of computation', prompt: 'Demystify quantum computing and its potential applications', icon: Zap, category: 'Technology', style: 'creative', cardCount: 8 },
  { id: 'tech-15', title: 'Tech Ethics & AI', description: 'Responsible innovation', prompt: 'Discuss ethical considerations in AI development and deployment', icon: Heart, category: 'Technology', style: 'professional', cardCount: 11 },

  // Health & Wellness (10)
  { id: 'health-1', title: 'Mental Health Awareness', description: 'Promote psychological wellbeing', prompt: 'Create mental health awareness presentation for workplace wellness', icon: Heart, category: 'Health', style: 'modern', cardCount: 12 },
  { id: 'health-2', title: 'Nutrition Guidelines', description: 'Evidence-based dietary advice', prompt: 'Present evidence-based nutrition guidelines for optimal health', icon: Heart, category: 'Health', style: 'professional', cardCount: 10 },
  { id: 'health-3', title: 'Fitness Program Design', description: 'Personalized workout plans', prompt: 'Design a comprehensive fitness program for beginners', icon: Zap, category: 'Health', style: 'creative', cardCount: 11 },
  { id: 'health-4', title: 'Stress Management', description: 'Coping strategies for modern life', prompt: 'Present stress management techniques and mindfulness practices', icon: Heart, category: 'Health', style: 'modern', cardCount: 9 },
  { id: 'health-5', title: 'Sleep Optimization', description: 'Improve your rest quality', prompt: 'Create a presentation on sleep science and optimization strategies', icon: Heart, category: 'Health', style: 'professional', cardCount: 8 },
  { id: 'health-6', title: 'Workplace Wellness', description: 'Healthy work environment', prompt: 'Develop workplace wellness initiatives for employee health', icon: Users, category: 'Health', style: 'modern', cardCount: 10 },
  { id: 'health-7', title: 'Disease Prevention', description: 'Proactive health measures', prompt: 'Present preventive health measures and early detection strategies', icon: Shield, category: 'Health', style: 'professional', cardCount: 12 },
  { id: 'health-8', title: 'Healthy Aging', description: 'Wellness for seniors', prompt: 'Create healthy aging strategies and wellness tips for seniors', icon: Heart, category: 'Health', style: 'classic', cardCount: 9 },
  { id: 'health-9', title: 'Mindfulness Practice', description: 'Meditation and awareness', prompt: 'Introduce mindfulness practices and meditation techniques', icon: Globe, category: 'Health', style: 'minimalist', cardCount: 7 },
  { id: 'health-10', title: 'Digital Wellness', description: 'Healthy technology habits', prompt: 'Present strategies for maintaining digital wellness and screen time balance', icon: Zap, category: 'Health', style: 'modern', cardCount: 8 },

  // Creative & Design (10)
  { id: 'creative-1', title: 'Color Theory Basics', description: 'Understanding color in design', prompt: 'Explain color theory principles and their application in graphic design', icon: Lightbulb, category: 'Creative', style: 'creative', cardCount: 9 },
  { id: 'creative-2', title: 'Typography Fundamentals', description: 'Fonts and text design', prompt: 'Present typography fundamentals and font pairing techniques', icon: BookOpen, category: 'Creative', style: 'minimalist', cardCount: 8 },
  { id: 'creative-3', title: 'Logo Design Process', description: 'From concept to final mark', prompt: 'Walk through the logo design process for a tech startup', icon: Lightbulb, category: 'Creative', style: 'creative', cardCount: 10 },
  { id: 'creative-4', title: 'Brand Identity Design', description: 'Complete visual identity', prompt: 'Create a brand identity presentation including logo, colors, and guidelines', icon: Heart, category: 'Creative', style: 'creative', cardCount: 12 },
  { id: 'creative-5', title: 'UI/UX Design Principles', description: 'User-centered design approach', prompt: 'Present UI/UX design principles with practical examples', icon: Zap, category: 'Creative', style: 'modern', cardCount: 11 },
  { id: 'creative-6', title: 'Photography Portfolio', description: 'Showcase visual storytelling', prompt: 'Create a photography portfolio presentation highlighting different styles', icon: Lightbulb, category: 'Creative', style: 'elegant', cardCount: 9 },
  { id: 'creative-7', title: 'Animation Techniques', description: 'Bring designs to life', prompt: 'Introduce animation techniques for web and mobile interfaces', icon: Zap, category: 'Creative', style: 'creative', cardCount: 10 },
  { id: 'creative-8', title: 'Design Thinking Process', description: 'Human-centered problem solving', prompt: 'Present the design thinking methodology with case studies', icon: Lightbulb, category: 'Creative', style: 'modern', cardCount: 12 },
  { id: 'creative-9', title: 'Sustainable Design', description: 'Eco-friendly creative solutions', prompt: 'Explore sustainable design practices and eco-friendly materials', icon: Globe, category: 'Creative', style: 'minimalist', cardCount: 8 },
  { id: 'creative-10', title: 'Art History Overview', description: 'Movements and masterpieces', prompt: 'Create an art history presentation covering major movements and artists', icon: BookOpen, category: 'Creative', style: 'classic', cardCount: 11 },

  // Personal Development (10)
  { id: 'personal-1', title: 'Goal Setting Workshop', description: 'Achieve your dreams', prompt: 'Facilitate a goal-setting workshop with actionable frameworks', icon: Target, category: 'Personal', style: 'modern', cardCount: 9 },
  { id: 'personal-2', title: 'Time Management Mastery', description: 'Maximize productivity', prompt: 'Present time management techniques and productivity hacks', icon: Zap, category: 'Personal', style: 'professional', cardCount: 10 },
  { id: 'personal-3', title: 'Public Speaking Skills', description: 'Confident communication', prompt: 'Create a presentation on developing public speaking confidence', icon: Users, category: 'Personal', style: 'professional', cardCount: 11 },
  { id: 'personal-4', title: 'Career Development Plan', description: 'Advance your professional growth', prompt: 'Design a career development presentation for mid-level professionals', icon: TrendingUp, category: 'Personal', style: 'modern', cardCount: 12 },
  { id: 'personal-5', title: 'Financial Planning 101', description: 'Secure your financial future', prompt: 'Introduce personal financial planning concepts and strategies', icon: BarChart3, category: 'Personal', style: 'professional', cardCount: 10 },
  { id: 'personal-6', title: 'Leadership Qualities', description: 'Develop leadership skills', prompt: 'Present essential leadership qualities and development strategies', icon: Users, category: 'Personal', style: 'elegant', cardCount: 11 },
  { id: 'personal-7', title: 'Networking Strategies', description: 'Build meaningful connections', prompt: 'Create effective networking strategies for professional growth', icon: Globe, category: 'Personal', style: 'modern', cardCount: 8 },
  { id: 'personal-8', title: 'Work-Life Balance', description: 'Harmony between career and life', prompt: 'Present strategies for achieving work-life balance in demanding careers', icon: Heart, category: 'Personal', style: 'minimalist', cardCount: 9 },
  { id: 'personal-9', title: 'Creative Thinking', description: 'Unlock innovation potential', prompt: 'Introduce creative thinking techniques and innovation exercises', icon: Lightbulb, category: 'Personal', style: 'creative', cardCount: 10 },
  { id: 'personal-10', title: 'Digital Detox Plan', description: 'Healthy technology relationship', prompt: 'Create a digital detox plan for improving mental wellbeing', icon: Heart, category: 'Personal', style: 'minimalist', cardCount: 7 }
];

const iconMap = {
  TrendingUp,
  Users,
  Lightbulb,
  Target,
  BookOpen,
  BarChart3,
  Globe,
  Zap,
  Heart,
  Shield,
  RefreshCw
};

interface PresentationExamplesProps {
  onSelectExample: (example: Example) => void;
}

export function PresentationExamples({ onSelectExample }: PresentationExamplesProps) {
  const [currentExamples, setCurrentExamples] = useState<Example[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Initialize with first 6 examples
  useEffect(() => {
    setCurrentExamples(presentationExamples.slice(0, 6));
  }, []);

  // Cycle through examples every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const newIndex = (prevIndex + 6) % presentationExamples.length;
        setCurrentExamples(presentationExamples.slice(newIndex, newIndex + 6));
        return newIndex;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleManualCycle = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex + 6) % presentationExamples.length;
      setCurrentExamples(presentationExamples.slice(newIndex, newIndex + 6));
      return newIndex;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800">Popular Examples</h3>
        <button
          onClick={handleManualCycle}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <RefreshCw className="w-4 h-4" />
          More examples
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentExamples.map((example) => {
          const IconComponent = iconMap[example.icon as keyof typeof iconMap] || Sparkles;
          return (
            <Card
              key={example.id}
              className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 bg-white/80 backdrop-blur-sm border-gray-200/80"
              onClick={() => onSelectExample(example)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <IconComponent className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">
                      {example.title}
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">
                      {example.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {example.category}
                      </span>
                      <span>{example.cardCount} slides</span>
                      <span className="capitalize">{example.style}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export { presentationExamples, type Example };
