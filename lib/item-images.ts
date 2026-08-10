export const ITEM_IMAGES: Record<string, string> = {
  "aloe-vera":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG3pkqQTGzmWT05gSIYSB0dStNBssaqmPo25tu_nzY0cjeVdo8xDPVl3cT&s=10",
  amla: "https://cdn.britannica.com/85/282185-050-137CB28F/Indian-Gooseberries-Amla-Phyllanthus-Emblica-On-Tree.jpg",
  "arjun-chhal":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTARAWlScu5ldoSnztfLrNF6AwI6cp7RSPaTSkax1a8rrtoD7YZ2PLzx38&s=10",
  ashwagandha:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd3hjHDwcyq_pVgCgqbLYp7yhTDdhrQmIdPIqW3yad_fxoQAtq9Cgo7qI&s=10",
  brahmi:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvU9vAitQPyA-vbi95Uo6fxZs1Hj74unZ2xmxjXzUJSeWzN_2bJuL3baA&s=10",
  giloy: "https://m.media-amazon.com/images/I/61zwYuTFe8L._AC_UF1000,1000_QL80_.jpg",
  gokhru: "https://nauratanspices.com/wp-content/uploads/2021/07/gokhru-kanta.jpg",
  guggul:
    "https://www.cureveda.com/cdn/shop/files/Untitled_design_57.png?v=1720607832",
  haldi:
    "https://www.cureveda.com/cdn/shop/files/Untitled_design_57.png?v=1720607832",
  isabgol:
    "https://thewholesaler.in/cdn/shop/products/Edible-Isabgol-Seeds-Psyllium-Seeds-Isab-Gol-Beej-Plantago-ovata-TheWholesalerCo-35839324_460x@2x.jpg?v=1755872822",
  kalmegh:
    "https://www.iafaforallergy.com/wp-content/uploads/2023/11/Kalamegha-%E2%80%93-Andrographis-paniculata-Burm.-b.-1.jpg",
  moringa:
    "https://rawleafstory.com/cdn/shop/products/organic-moringa-leaves.jpg?v=1626431148",
};

export function getItemImage(slug: string, existingImage?: string | null): string {
  return existingImage || ITEM_IMAGES[slug] || "";
}
