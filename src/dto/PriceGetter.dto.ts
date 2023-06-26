interface PriceGetter {
  getPrice: () => Promise<number>
}

export default PriceGetter;