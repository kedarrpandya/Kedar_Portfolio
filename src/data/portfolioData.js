// Kedar Pandya's Complete Portfolio Data
export const portfolioData = {
  // Personal Information
  personal: {
    name: "Kedar Pandya",
    title: "Software Development & Data Solutions Engineer",
    tagline: "Transforming Data into Strategic Insights",
    location: "Canada",
    phone: "+1 (226) 961-4110",
    email: "pandya18@uwindsor.ca",
    portfolio: "#",
    linkedin: "https://www.linkedin.com/in/kedarrpandya",
    github: "https://github.com/kedarrpandya",
    summary: "Data Analyst with practical experience in SQL, Python, and data visualization, focused on delivering high-impact dashboards and reports to drive business decision-making. Skilled in data modeling, database querying, and operating within Agile frameworks to support the full software development lifecycle (SDLC). Strong interpersonal and communication skills with a track record of gathering and analyzing business requirements, collaborating with cross-functional teams, and supporting prioritization of tasks based on project impact."
  },

  // Professional Experience - The Journey
  experience: [
    {
      id: 1,
      role: "Data Analyst (SQL & BI)",
      company: "Great Lakes Greenhouse",
      location: "Windsor, ON",
      startDate: "Jan 2025",
      endDate: "Apr 2025",
      current: true,
      type: "full-time",
      description: "Leading BI initiatives and data optimization for agricultural technology solutions.",
      achievements: [
        "Wrote optimized SQL queries to clean, filter, and structure data for visualization and reporting",
        "Built and deployed interactive Tableau dashboards to track greenhouse productivity and workforce KPIs",
        "Reduced manual processing by 45% by integrating dashboards directly with SQL Server",
        "Collaborated with cross-functional teams to define KPIs, validate outputs, and ensure data accuracy"
      ],
      technologies: ["SQL Server", "Tableau", "Python", "ETL", "KPI Design"],
      impact: "45% reduction in manual processing",
      color: "#4CAF50"
    },
    {
      id: 2,
      role: "Freelance Data Analyst",
      company: "Independent Consulting",
      location: "Remote",
      startDate: "Apr 2022",
      endDate: "Mar 2025",
      current: false,
      type: "freelance",
      description: "Providing data analytics and BI solutions across travel and beverage industries.",
      achievements: [
        "Gathered requirements, designed ETL workflows in Python, and modeled data for performance dashboards",
        "Built interactive Tableau and Power BI reports for travel and beverage industry clients, improving decision-making",
        "Delivered accurate and insightful reporting solutions through multiple Agile development cycles",
        "Documented business rules and reporting KPIs, aligned with executive goals"
      ],
      technologies: ["Tableau", "Power BI", "Python", "ETL", "Agile"],
      impact: "Multiple successful client deliveries",
      color: "#2196F3"
    },
    {
      id: 3,
      role: "DevOps Platform Engineer",
      company: "Trend Micro Inc.",
      location: "Remote",
      startDate: "Jun 2023",
      endDate: "Oct 2023",
      current: false,
      type: "full-time",
      description: "Automated cloud testing processes and managed security infrastructure at scale.",
      achievements: [
        "Created automation scripts in Python and Bash to streamline cloud testing and release processes",
        "Managed and monitored SQL logs for anomaly detection and incident tracking across test environments",
        "Partnered with global DevOps and QA teams to manage security and endpoint configuration tools",
        "Reduced manual workload by 40% through automated reporting of system health KPIs"
      ],
      technologies: ["Python", "Bash", "SQL", "AWS", "DevOps", "Security"],
      impact: "40% reduction in manual workload",
      color: "#FF9800"
    },
    {
      id: 4,
      role: "Cyber Security Intern",
      company: "Trend Micro Inc.",
      location: "India",
      startDate: "Jan 2023",
      endDate: "Jun 2023",
      current: false,
      type: "internship",
      description: "Supporting endpoint security operations and threat detection systems.",
      achievements: [
        "Supported endpoint security tool testing and monitored logs for breach patterns and vulnerabilities",
        "Generated internal reports and dashboards tracking network defense KPIs and incidents",
        "Assisted senior engineers with penetration testing procedures and patch rollout analysis",
        "Documented system alerts and recommended optimizations in policy enforcement"
      ],
      technologies: ["Security Tools", "Log Analysis", "Penetration Testing", "Monitoring"],
      impact: "Enhanced security monitoring capabilities",
      color: "#F44336"
    },
    {
      id: 5,
      role: "Computer Solutions Advisor",
      company: "Best Buy Canada",
      location: "Windsor, ON",
      startDate: "Aug 2024",
      endDate: "Present",
      current: true,
      type: "part-time",
      description: "Providing technical support and solutions to customers while pursuing education.",
      achievements: [
        "Assisted 60+ customers weekly with troubleshooting, software installations, and PC hardware upgrades",
        "Delivered tailored recommendations for personal and enterprise tech solutions using data-driven upselling",
        "Managed system diagnostics and helped increase tech support satisfaction scores during the holiday season",
        "Collaborated with the Geek Squad team to streamline tech intake and reduce service wait times"
      ],
      technologies: ["Hardware Diagnostics", "Customer Service", "Technical Support"],
      impact: "60+ customers assisted weekly",
      color: "#9C27B0"
    }
  ],

  // Technical Skills Arsenal
  skills: {
    "BI & Analysis": {
      items: ["Tableau", "Power BI", "Excel", "KPI Design", "Report Automation", "Agile Methodology"],
      level: 90,
      color: "#4CAF50"
    },
    "Programming": {
      items: ["SQL", "Python", "Bash", "JavaScript", "Java"],
      level: 85,
      color: "#2196F3"
    },
    "Data Engineering": {
      items: ["Data Modeling", "ETL", "Data Cleaning", "PySpark", "Streamlit"],
      level: 80,
      color: "#FF9800"
    },
    "QA & Testing": {
      items: ["Unit Testing", "UAT", "Debugging", "User Story Validation"],
      level: 75,
      color: "#F44336"
    },
    "Tools/Platforms": {
      items: ["SSMS", "Salesforce", "JIRA", "Confluence", "Git", "AWS S3", "Kafka"],
      level: 82,
      color: "#9C27B0"
    },
    "Soft Skills": {
      items: ["Communication", "Requirement Gathering", "Stakeholder Alignment", "Documentation"],
      level: 88,
      color: "#607D8B"
    }
  },

  // Education Journey
  education: [
    {
      id: 1,
      degree: "Master of Applied Computing",
      school: "University of Windsor",
      location: "Windsor, ON",
      startDate: "Jan 2024",
      endDate: "Apr 2025",
      current: true,
      description: "Advanced computing program focusing on practical applications in data analytics and software development.",
      relevantCourses: ["Advanced Database Systems", "Machine Learning", "Big Data Analytics", "Software Engineering"],
      gpa: "Ongoing"
    },
    {
      id: 2,
      degree: "B.Tech in ICT (Information and Communication Technology)",
      school: "Ganpat University",
      location: "Gujarat, India",
      startDate: "Jun 2019",
      endDate: "Jun 2023",
      current: false,
      description: "Comprehensive technology program covering software development, networking, and system administration.",
      relevantCourses: ["Database Management", "Software Engineering", "Network Security", "Data Structures"],
      gpa: "First Class"
    }
  ],

  // Flagship Projects
  projects: [
    {
      id: 1,
      title: "Health in Changing Climate",
      subtitle: "Climate Data Analytics Platform",
      description: "Developed interactive dashboards using Streamlit and Tableau to visualize climate trends and health impacts.",
      longDescription: "A comprehensive data analytics platform that processes climate and health data to provide actionable insights for public health decision-making. The system handles large-scale environmental datasets and provides predictive modeling capabilities.",
      technologies: ["Streamlit", "SparkSQL", "Tableau", "Apache Spark", "Python"],
      category: "Data Analytics",
      featured: true,
      year: "2024",
      duration: "3 months",
      team: "Solo Project",
      achievements: [
        "Processed pollution and temperature datasets with Apache Spark for scalable analysis",
        "Implemented regression trees to forecast temperature variations from pollution inputs (MSE: 16.65%)",
        "Enabled exploratory filtering by region, pollutant type, and health index metrics for stakeholder use",
        "Built interactive visualizations for climate trend analysis"
      ],
      metrics: {
        "Data Points Processed": "10M+",
        "Prediction Accuracy": "83.35%",
        "Regions Covered": "50+",
        "Dashboard Views": "1000+"
      },
      links: {
        demo: "#",
        github: "#",
        documentation: "#"
      },
      images: [
        "/project1-dashboard.png",
        "/project1-analytics.png"
      ]
    },
    {
      id: 2,
      title: "SQL Server to Snowflake Migration",
      subtitle: "Enterprise Data Pipeline",
      description: "Engineered scalable data pipeline for enterprise database migration using modern cloud technologies.",
      longDescription: "A robust data migration solution that enables seamless transfer of enterprise data from on-premise SQL Server to Snowflake cloud data warehouse, ensuring data integrity and minimal downtime.",
      technologies: ["Kafka", "AWS S3", "Python", "Snowflake", "SQL Server"],
      category: "Data Engineering",
      featured: true,
      year: "2024",
      duration: "4 months",
      team: "3 Engineers",
      achievements: [
        "Engineered data pipeline for incremental table-level migration using Kafka and S3 as staging",
        "Mapped SQL Server schemas to Snowflake models and managed connection retries and offset tracking",
        "Built modular Python scripts for data ingestion, schema validation, and migration logs",
        "Conducted post-migration verification using Snowflake query audits and record-level comparisons"
      ],
      metrics: {
        "Data Migrated": "500TB+",
        "Tables Processed": "1000+",
        "Migration Speed": "10GB/min",
        "Success Rate": "99.9%"
      },
      links: {
        demo: "#",
        github: "#",
        documentation: "#"
      },
      images: [
        "/project2-pipeline.png",
        "/project2-monitoring.png"
      ]
    },
    {
      id: 3,
      title: "MarineBot Analyst",
      subtitle: "Underwater Robotics Dashboard",
      description: "Flask-based dashboard for real-time underwater rover monitoring with AI-powered object detection.",
      longDescription: "An innovative robotics monitoring system that combines computer vision, real-time data streaming, and intelligent navigation to enhance underwater exploration capabilities.",
      technologies: ["Flask", "YOLOv8", "MATLAB", "Computer Vision", "IoT"],
      category: "AI & Robotics",
      featured: true,
      year: "2023",
      duration: "6 months",
      team: "4 Engineers",
      achievements: [
        "Designed Flask-based dashboard to stream and visualize underwater rover video data",
        "Integrated YOLOv8 object detection for identifying marine objects and obstructions",
        "Used MATLAB scripts for navigation control and real-time rover path adjustments",
        "Fused ML outputs with sensor data to improve obstacle avoidance by over 40%"
      ],
      metrics: {
        "Detection Accuracy": "92%",
        "Obstacle Avoidance": "+40%",
        "Real-time Processing": "30 FPS",
        "Dive Duration": "8 hours"
      },
      links: {
        demo: "#",
        github: "#",
        documentation: "#"
      },
      images: [
        "/project3-rover.png",
        "/project3-dashboard.png"
      ]
    },
    {
      id: 4,
      title: "Student Lifecycle Management System",
      subtitle: "Hackathon Winner - 48 Hours",
      description: "Built comprehensive student management platform during national hackathon competition.",
      longDescription: "A rapid-development project showcasing full-stack capabilities and system design skills under pressure. Created during a 48-hour hackathon with focus on student administration and lifecycle tracking.",
      technologies: ["React", "Node.js", "PostgreSQL", "Express", "Material-UI"],
      category: "Full-Stack Development",
      featured: false,
      year: "2023",
      duration: "48 hours",
      team: "Hackathon Lead",
      achievements: [
        "Led team of 5 developers in 48-hour development sprint",
        "Designed complete student information system from scratch",
        "Implemented real-time notifications and dashboard analytics",
        "Won first place in national-level hackathon competition"
      ],
      metrics: {
        "Development Time": "48 hours",
        "Team Size": "5 developers",
        "Features Built": "25+",
        "Award": "1st Place"
      },
      links: {
        demo: "#",
        github: "#",
        documentation: "#"
      },
      images: [
        "/project4-hackathon.png",
        "/project4-system.png"
      ]
    }
  ],

  // Professional Certifications
  certifications: [
    {
      id: 1,
      name: "Apex One Certification - Level 3",
      issuer: "Trend Micro",
      date: "2023",
      credentialId: "TMC-2023-L3",
      description: "Advanced endpoint security and threat detection certification",
      skills: ["Endpoint Security", "Threat Detection", "Security Analysis"],
      verified: true
    },
    {
      id: 2,
      name: "AWS Certified Machine Learning Specialty",
      issuer: "Amazon Web Services",
      date: "2024",
      credentialId: "AWS-ML-2024",
      description: "Demonstrates expertise in building and deploying ML solutions on AWS",
      skills: ["Machine Learning", "AWS", "Model Deployment", "Data Processing"],
      verified: true
    },
    {
      id: 3,
      name: "AWS Certified Data Analytics Specialty",
      issuer: "Amazon Web Services",
      date: "2024",
      credentialId: "AWS-DA-2024",
      description: "Validates skills in designing and implementing data analytics solutions",
      skills: ["Data Analytics", "Big Data", "ETL", "Data Visualization"],
      verified: true
    }
  ],

  // Leadership & Achievements
  leadership: [
    {
      id: 1,
      title: "Placement Coordinator",
      organization: "Ganpat University",
      description: "Facilitated 70+ company drives, assisting 250+ students with placements",
      period: "2022-2023",
      impact: "250+ students placed",
      skills: ["Leadership", "Communication", "Event Management", "Career Counseling"]
    },
    {
      id: 2,
      title: "Hackathon Lead",
      organization: "National Hackathon",
      description: "Built a Student Lifecycle Management System in 48 hours during national hackathon",
      period: "2023",
      impact: "1st Place Winner",
      skills: ["Team Leadership", "Rapid Development", "System Design", "Project Management"]
    }
  ],

  // Career Timeline Highlights
  timeline: [
    { year: "2019", event: "Started B.Tech in ICT at Ganpat University", type: "education" },
    { year: "2022", event: "Began Freelance Data Analytics Career", type: "career" },
    { year: "2023", event: "Cybersecurity Intern at Trend Micro", type: "career" },
    { year: "2023", event: "Won National Hackathon Competition", type: "achievement" },
    { year: "2023", event: "DevOps Platform Engineer at Trend Micro", type: "career" },
    { year: "2023", event: "Graduated B.Tech with First Class", type: "education" },
    { year: "2024", event: "Started Master's at University of Windsor", type: "education" },
    { year: "2024", event: "AWS ML & Data Analytics Certifications", type: "achievement" },
    { year: "2024", event: "Computer Solutions Advisor at Best Buy", type: "career" },
    { year: "2025", event: "Data Analyst at Great Lakes Greenhouse", type: "career" }
  ]
} 