import { Auction } from "../models/Auction";

export let auctions: Array<Auction> = [];

export function Init() {
    // Lyxbilar
    auctions.push(new Auction(
        "MB-AMG",
        "Mercedes-Benz AMG GT 2024",
        1200000
    ));
    auctions.push(new Auction(
        "POR-911",
        "Porsche 911 GT3 RS",
        2500000
    ));

    
    auctions.push(new Auction(
        "BMW-M4",
        "BMW M4 Competition",
        950000
    ));
    auctions.push(new Auction(
        "AUD-RS7",
        "Audi RS7 Sportback",
        1100000
    ));


    auctions.push(new Auction(
        "FER-365",
        "Ferrari 365 GTB/4 Daytona 1971",
        4500000
    ));
    auctions.push(new Auction(
        "MUS-67",
        "Ford Mustang Fastback 1967",
        750000
    ));

    
    auctions.push(new Auction(
        "TES-MS",
        "Tesla Model S Plaid",
        1300000
    ));
    auctions.push(new Auction(
        "POR-TAY",
        "Porsche Taycan Turbo S",
        1800000
    ));

    auctions.push(new Auction(
        "RR-SVR",
        "Range Rover Sport SVR",
        1600000
    ));
    auctions.push(new Auction(
        "LAM-URU",
        "Lamborghini Urus",
        2800000
    ));


    auctions.forEach(auction => {
        switch(auction.id) {
            case "MB-AMG":
                auction.description = "En helt ny Mercedes-AMG GT med 585 hk V8-motor. Färg: AMG Green Hell Magno.";
                auction.imageUrl = "https://www.mercedes-benz.se/content/sweden/sv/passengercars/_jcr_content/root/responsivegrid/simple_teaser_115569/simple_teaser_item_c_1019047280.component.damq2.3333333333333335.jpg/mercedes-amg-gt-coupe-x290-exterior-c190-amg-line-night-package-selenitgrau-magno-2022-3400x1440.jpg";
                auction.category = "luxury";
                break;
            case "POR-911":
                auction.description = "Porsche 911 GT3 RS med PDK växellåda och Weissach-paket. Endast 100 mil.";
                auction.imageUrl = "https://files.porsche.com/filestore/image/multimedia/none/911-gt3-rs-modelimage-sideshot/model/765148bb-6f4d-11ed-80f5-005056bbdc38/porsche-model.png";
                auction.category = "luxury";
                break;
            case "BMW-M4":
                auction.description = "BMW M4 Competition med M xDrive. Brooklyn Grey metallic, kolfibertak.";
                auction.imageUrl = "https://www.bmw.se/content/dam/bmw/common/all-models/m-series/m4-coupe/2023/highlights/bmw-4-series-m4-cs-exterior-interior-desktop.jpg";
                auction.category = "sport";
                break;
            case "AUD-RS7":
                auction.description = "Audi RS7 Sportback med 600 hk. Nardo Grey, dynamikpaket plus.";
                auction.imageUrl = "https://mediaservice.audi.com/media/live/50900/fly1400x601n8/f2brpa/2023.png";
                auction.category = "sport";
                break;
            case "FER-365":
                auction.description = "Klassisk Ferrari 365 GTB/4 Daytona från 1971. Fullständig restaurering 2019.";
                auction.imageUrl = "https://www.classicdriver.com/sites/default/files/cars_images/feed_706854/7d89d45a82b911e9b4c50242ac110003_large.jpg";
                auction.category = "classic";
                break;
            case "MUS-67":
                auction.description = "Ford Mustang Fastback 1967, 390 GT. Helt originalskick, Highland Green.";
                auction.imageUrl = "https://www.motortrend.com/uploads/sites/21/2020/05/1967-Ford-Mustang-Fastback-Front-Three-Quarter.jpg";
                auction.category = "classic";
                break;
            case "TES-MS":
                auction.description = "Tesla Model S Plaid med över 1000 hk. Midnight Silver Metallic.";
                auction.imageUrl = "https://tesla-cdn.thron.com/delivery/public/image/tesla/8fa80996-ac5c-4cef-9534-a61d48c28446/bvlatuR/std/4096x2560/Model-S-Main-Hero-Desktop-LHD";
                auction.category = "electric";
                break;
            case "POR-TAY":
                auction.description = "Porsche Taycan Turbo S med Performance Battery Plus. Gentian Blue Metallic.";
                auction.imageUrl = "https://files.porsche.com/filestore/image/multimedia/none/j1-taycan-modelimage-sideshot/model/cfbb8ed3-31d4-11ed-80f5-005056bbdc38/porsche-model.png";
                auction.category = "electric";
                break;
            case "RR-SVR":
                auction.description = "Range Rover Sport SVR med 575 hk V8. Estoril Blue, kolfiber-detaljer.";
                auction.imageUrl = "https://media.landrover.com/image/upload/f_auto,fl_lossy,q_auto/v1651057424/landrover/uk/vehicles/range-rover-sport/l461/23my/l461_23my_108_glhd.jpg";
                auction.category = "suv";
                break;
            case "LAM-URU":
                auction.description = "Lamborghini Urus med 650 hk. Giallo Auge, svart Alcantara interiör.";
                auction.imageUrl = "https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/facelift_2019/model_gw/urus/2023/model_chooser/urus_s_m.jpg";
                auction.category = "suv";
                break;
        }
    });
}


