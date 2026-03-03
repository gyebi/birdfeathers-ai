// js/state.js
export const state = {
  flow: {
    birdType: null,
    step: 1
  },

  birds: {
    broilers: 0,
    layers: 0,
  },

  batch: {
    broilerCost: 0,
    layerCost: 0,
  },

  production: {
    broilerWeeks: 6, // default to 6 weeks
    layerWeeks: 24, // time to first egg

    layer: {
    dailyMarshFeedPerLayer: 0.115, // 0.115kg per day
    rateOfLay: 0.0, // 80%
    cycleDays: 540, // 18 months
    cullThreshold: 0.6,
    resalePricePerBird: 0
  }
  },

  feed: {
    bagWeight:50, // kg
    bagPrice: 0,
    
    broilers: {
      broilerStarter:{
          
          bagPrice: 0,
          totalKg: 0,
          totalBags: 0,
      },
      broilerFinisher:{
         
          bagPrice: 0,
          totalKg: 0,
          totalBags: 0,
      },
    },
  

    layers:{
            
       layerStarter:{
        bagPrice: 0,
        totalKg: 0,
        totalBags: 0
      },
      layerGrower:{ 
        bagPrice: 0,
        totalKg: 0,
        totalBags: 0
      },
      layerMash:{
        bagPrice: 0,
        totalKg: 0,
        totalBags: 0,
      },
    },
  },
  
  mortality: {
    broilerRate: 0, // percentage
    layerRate: 0,
  },


  revenue: {
    //broilerPricePerKg: 0,
    broilerPricePerBird: 0,

    broilerSellPrice: 0,
    
    layerEggPricePerCrate: 0,
    averageEggsPerLayer: 280, // yearly estimate
  },

results: {
  feed: {
    totalKg: 0,
    totalBags: 0,
    totalCost: 0
  },

  revenue: {
    totalRevenue: 0
  },

  mortality: {
    totalDead: 0,
    mortalityRate: 0
  },

  profit: {
    totalCost: 0,
    netProfit: 0
  }
},

summary: {
  version: 1,
  lastSavedAt: null,

  costs: {
    chickCost: 0,
    feedCostBroilers: 0,
    feedCostLayers: 0,
    totalCost: 0
  },

  revenue: {
    broilerRevenue: 0,
    eggRevenue: 0,
    resaleRevenue: 0,
    totalRevenue: 0
  },

  profit: {
    value: 0
  },

  survival: {
    survivingBroilers: 0,
    survivingLayers: 0
  }
}


};
