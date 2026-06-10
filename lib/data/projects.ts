import type { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "proctor-ai",
    title: "Proctor AI",
    tagline: "Intelligent Exam Monitoring",
    description:
      "Real-time AI proctoring system with gaze tracking, anomaly detection, and integrity scoring for remote examinations.",
    emoji: "👁️",
    category: "Computer Vision",
    metrics: [
      { label: "Detection", value: "98.2%" },
      { label: "Latency", value: "<120ms" },
      { label: "Sessions", value: "10K+" },
    ],
    stack: ["PyTorch", "OpenCV", "YOLO", "FastAPI"],
    href: "https://github.com/hashirsakimdad",
    gradient: "from-cyan-500/20 via-blue-600/10 to-transparent",
    accent: "cyan",
  },
  {
    id: "bank-ocr",
    title: "Bank Statement OCR",
    tagline: "Financial Document Intelligence",
    description:
      "Intelligent OCR pipeline extracting structured data from messy real-world bank statements with high field accuracy.",
    emoji: "🏦",
    category: "OCR · Fintech",
    metrics: [
      { label: "Accuracy", value: "96.5%" },
      { label: "Fields", value: "24+" },
      { label: "Banks", value: "12" },
    ],
    stack: ["OCR", "Document AI", "FastAPI", "Python"],
    href: "https://github.com/hashirsakimdad",
    gradient: "from-purple-500/20 via-violet-600/10 to-transparent",
    accent: "purple",
  },
  {
    id: "colorcode-scanner",
    title: "ColorCode Scanner",
    tagline: "Spectral Analysis Engine",
    description:
      "Computer vision system for precise color identification and classification in industrial quality control workflows.",
    emoji: "🎨",
    category: "Computer Vision",
    metrics: [
      { label: "Precision", value: "99.1%" },
      { label: "Colors", value: "2.4K" },
      { label: "Speed", value: "30fps" },
    ],
    stack: ["OpenCV", "PyTorch", "NumPy", "Flask"],
    href: "https://github.com/hashirsakimdad",
    gradient: "from-fuchsia-500/20 via-pink-600/10 to-transparent",
    accent: "magenta",
  },
  {
    id: "wanted-detection",
    title: "Wanted Person Detection",
    tagline: "Surveillance Intelligence",
    description:
      "Face recognition and person-of-interest detection system with real-time alerting for security applications.",
    emoji: "🔍",
    category: "Deep Learning",
    metrics: [
      { label: "Recall", value: "97.8%" },
      { label: "FPS", value: "25" },
      { label: "Database", value: "50K" },
    ],
    stack: ["FaceNet", "YOLO", "OpenCV", "Redis"],
    href: "https://github.com/hashirsakimdad",
    gradient: "from-amber-500/20 via-orange-600/10 to-transparent",
    accent: "amber",
  },
  {
    id: "hexapod-robot",
    title: "Hexapod Robot",
    tagline: "Autonomous Locomotion",
    description:
      "Six-legged robotic platform with inverse kinematics, terrain adaptation, and computer vision navigation.",
    emoji: "🦾",
    category: "Robotics · IoT",
    metrics: [
      { label: "Legs", value: "6" },
      { label: "DOF", value: "18" },
      { label: "Gait", value: "3 modes" },
    ],
    stack: ["Arduino", "ROS", "Python", "OpenCV"],
    href: "https://github.com/hashirsakimdad",
    gradient: "from-cyan-500/20 via-purple-600/10 to-transparent",
    accent: "cyan",
  },
];
