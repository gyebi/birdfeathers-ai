export const translations = {

  en: {

    helpTitle: "How BirdFeathers Works",
    steps: "Steps",
    resultsTitle: "Results Summary",
    costsReminder: "Costs not included yet"

  },

  fr: {

    helpTitle: "Comment fonctionne BirdFeathers",
    steps: "Étapes",
    resultsTitle: "Résumé des résultats",
    costsReminder: "Coûts non inclus"

  }

};

export function t(key, language){

  return translations[language][key] || key;

}