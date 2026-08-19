
export interface Member {
  img: string;
  name: string;
  duty: string;
  socials: {
    facebook?: string;
    x?: string;
    instagram?: string;
    tiktok?: string;
  };
}

export const teamMembers: Member[] = [
  {
    img: "/assets/images/member/member-1.jpg",
    name: "Annette Black",
    duty: "Founder/CEO",
    socials: {
      facebook: "https://www.facebook.com/",
      x: "https://x.com/",
      instagram: "https://www.instagram.com/",
      tiktok: "https://www.tiktok.com/",
    },
  },
  {
    img: "/assets/images/member/member-2.jpg",
    name: "Brooklyn Simmons",
    duty: "Manager",
    socials: {
      facebook: "https://www.facebook.com/",
      x: "https://x.com/",
      instagram: "https://www.instagram.com/",
      tiktok: "https://www.tiktok.com/",
    },
  },
  {
    img: "/assets/images/member/member-3.jpg",
    name: "Jane Cooper",
    duty: "Sales Director",
    socials: {
      facebook: "https://www.facebook.com/",
      x: "https://x.com/",
      instagram: "https://www.instagram.com/",
      tiktok: "https://www.tiktok.com/",
    },
  },
  {
    img: "/assets/images/member/member-4.jpg",
    name: "Lisa Bonet",
    duty: "Sales Director",
    socials: {
      facebook: "https://www.facebook.com/",
      x: "https://x.com/",
      instagram: "https://www.instagram.com/",
      tiktok: "https://www.tiktok.com/",
    },
  },
];
