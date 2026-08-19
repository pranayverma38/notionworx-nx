import type { BrowseByCategoryItem } from "@/types/browseByCategory";

export const browseByCategoryItems: BrowseByCategoryItem[] = [
  {
    label: "Sleep & Recovery",
    href: "/shop-default",
    showCaret: true,
  },
  {
    label: "Stress & Anxiety Relief",
    href: "/shop-default",
    showCaret: true,
    subSections: [
      {
        title: "Relaxation Techniques",
        links: [
          { label: "Guided Meditation", href: "/shop-default" },
          { label: "Deep Breathing", href: "/shop-default" },
          { label: "Progressive Relaxation", href: "/shop-default" },
          { label: "Calming Sounds", href: "/shop-default" },
        ],
      },
      {
        title: "Stress Management Tools",
        links: [
          { label: "Daily Stress Log", href: "/shop-default" },
          { label: "Deep Breathing", href: "/shop-default" },
          { label: "Mood Tracker", href: "/shop-default" },
          { label: "Stress-Level Quiz", href: "/shop-default" },
        ],
      },
      {
        title: "Emotional Support Tips",
        links: [
          { label: "Coping Methods", href: "/shop-default" },
          { label: "Emotional Awareness", href: "/shop-default" },
          { label: "Reset Routines", href: "/shop-default" },
          { label: "Grounding Practices", href: "/shop-default" },
        ],
      },
      {
        title: "Natural Remedies",
        links: [
          { label: "Herbal Teas", href: "/shop-default" },
          { label: "Aromatherapy Oils", href: "/shop-default" },
          { label: "Calming Supplements", href: "/shop-default" },
          { label: "Sleep-Friendly Herbs", href: "/shop-default" },
        ],
      },
      {
        title: "Lifestyle Adjustments",
        links: [
          { label: "Sleep Hygiene", href: "/shop-default" },
          { label: "Workload Balancing", href: "/shop-default" },
          { label: "Break Scheduling", href: "/shop-default" },
          { label: "Digital Detox", href: "/shop-default" },
        ],
      },
      {
        title: "Mind-Body Practices",
        links: [
          { label: "Light Yoga", href: "/shop-default" },
          { label: "Stretch Routines", href: "/shop-default" },
          { label: "Mindful Walking", href: "/shop-default" },
          { label: "Body Scan Method", href: "/shop-default" },
        ],
      },
    ],
  },
  {
    label: "Focus & Productivity",
    href: "/shop-default",
  },
  {
    label: "Mood & Emotional Balance",
    href: "/shop-default",
    showCaret: true,
  },
  {
    label: "Daily Energy Boost",
    href: "/shop-default",
    showCaret: true,
  },
  {
    label: "Fitness & Body Strength",
    href: "/shop-default",
    showCaret: true,
  },
  {
    label: "Pain & Muscle Support",
    href: "/shop-default",
    showCaret: true,
  },
  {
    label: "Healthy Habits & Lifestyle",
    href: "/shop-default",
    showCaret: true,
  },
];
