const AUTO = -1;

const Global = {

  /* Initial Configuration */
  size: {
    width: 50,
    height: 30
  },
  scale: AUTO,
  initialInstance: 200,
  initialInfected: 10,
  simSpeed: 8, 	// lower == slower

  /* Hyper Parameters */
  lazinessMean: .5, // [0, 1]
  lazinessStd: .01,
  virusIncubationDayMean: 10,
  virusIncubationDayStd: 2,
  cureRate: .01,
  immuneMean: .03, // [0, 1) Immunity Mean. Very sensitive. Leave it be
  immuneStd: .01, // Immunity standard deviation

  /* Required System Variable */
  /* Do not change */
  day: 0
}