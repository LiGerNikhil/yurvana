import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com" },
      { protocol: "https", hostname: "www.grocery.coop", search: "" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "amscardiology.com", search: "" },
      { protocol: "https", hostname: "www.savvyandshine.com" },
      { protocol: "https", hostname: "domf5oio6qrcr.cloudfront.net", search: "" },
      { protocol: "https", hostname: "cdn.britannica.com", search: "" },
      { protocol: "https", hostname: "m.media-amazon.com", search: "" },
      { protocol: "https", hostname: "nauratanspices.com", search: "" },
      { protocol: "https", hostname: "www.cureveda.com" },
      { protocol: "https", hostname: "thewholesaler.in" },
      { protocol: "https", hostname: "www.iafaforallergy.com", search: "" },
      { protocol: "https", hostname: "rawleafstory.com" },
    ],
  },
};

export default nextConfig;
