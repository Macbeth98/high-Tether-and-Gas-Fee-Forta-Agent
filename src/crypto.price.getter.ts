import axios from "axios";
import PriceGetter from "./dto/PriceGetter.dto";

const API_URL = "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD";
const threeMins = 3 * 60 * 1000;

class CryptoPriceGetter implements PriceGetter {

  priceUsd: number;
  lastFetchTimestamp: number;

  fetchPrice = async () => {
    const response = await axios.get(API_URL);
    const data = response.data;
    this.priceUsd = data["USD"] as number;
    return this.priceUsd;
  }

  constructor() {
    this.priceUsd = 0;
    this.fetchPrice().catch(err => {console.log(err)});
    this.lastFetchTimestamp = Date.now();
  }

  async getPrice() {
    if (!(this.priceUsd > 0) || Date.now() - this.lastFetchTimestamp > threeMins) {
      await this.fetchPrice();
    }

    return this.priceUsd;
  }

}

export default CryptoPriceGetter;