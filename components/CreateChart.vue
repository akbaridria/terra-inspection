<template>
  <client-only>
    <div class="text-black">
      <apexchart
        :type="typeChart"
        :options="chartOptions"
        :series="series"
        :height="height"
      ></apexchart>
    </div>
  </client-only>
</template>

<script>
// import VueApexCharts from 'vue-apexcharts'
export default {
  components: {
    // VueApexCharts
  },
  props: {
    height: {
      type: String,
      required: false,
      default: "500",
    },
    title: {
      type: String,
      required: false,
      default: "Daily Contracts Deployed",
    },
    typeChart: {
      type: String,
      required: false,
      default: "area",
    },
    dataLabels: {
      type: Boolean,
      required: false,
      default: false,
    },
    dataSeries: {
      type: Array,
      required: false,
      default: () => [
        [1327359600000, 30.95],
        [1327446000000, 31.34],
        [1327532400000, 31.18],
        [1327618800000, 31.05],
        [1327878000000, 31.0],
        [1327964400000, 30.95],
        [1328050800000, 31.24],
        [1328137200000, 31.29],
        [1328223600000, 31.85],
        [1328482800000, 31.86],
        [1328569200000, 32.28],
        [1328655600000, 32.1],
        [1328742000000, 32.65],
        [1328828400000, 32.21],
        [1329087600000, 32.35],
        [1329174000000, 32.44],
        [1329260400000, 32.46],
        [1329346800000, 32.86],
        [1329433200000, 32.75],
        [1329778800000, 32.54],
        [1329865200000, 32.33],
        [1329951600000, 32.97],
        [1330038000000, 33.41],
        [1330297200000, 33.27],
        [1330383600000, 33.27],
        [1330470000000, 32.89],
        [1330556400000, 33.1],
        [1330642800000, 33.73],
        [1330902000000, 33.22],
        [1330988400000, 31.99],
        [1331074800000, 32.41],
        [1331161200000, 33.05],
        [1331247600000, 33.64],
        [1331506800000, 33.56],
        [1331593200000, 34.22],
        [1331679600000, 33.77],
        [1331766000000, 34.17],
        [1331852400000, 33.82],
        [1332111600000, 34.51],
        [1332198000000, 33.16],
        [1332284400000, 33.56],
        [1332370800000, 33.71],
        [1332457200000, 33.81],
        [1332712800000, 34.4],
        [1332799200000, 34.63],
        [1332885600000, 34.46],
        [1332972000000, 34.48],
        [1333058400000, 34.31],
        [1333317600000, 34.7],
        [1333404000000, 34.31],
        [1333490400000, 33.46],
        [1333576800000, 33.59],
        [1333922400000, 33.22],
        [1334008800000, 32.61],
        [1334095200000, 33.01],
        [1334181600000, 33.55],
        [1334268000000, 33.18],
        [1334527200000, 32.84],
        [1334613600000, 33.84],
        [1334700000000, 33.39],
        [1334786400000, 32.91],
        [1334872800000, 33.06],
        [1335132000000, 32.62],
        [1335218400000, 32.4],
        [1335304800000, 33.13],
        [1335391200000, 33.26],
        [1335477600000, 33.58],
        [1335736800000, 33.55],
        [1335823200000, 33.77],
        [1335909600000, 33.76],
        [1335996000000, 33.32],
        [1336082400000, 32.61],
        [1336341600000, 32.52],
        [1336428000000, 32.67],
        [1336514400000, 32.52],
      ],
    },
    aXaxis: {
      tyoe: Array,
      required: false,
      default: () => [
        {
          x: new Date('2023-01-15').getTime(),
          strokeDashArray: 2,
          borderColor: "#775DD0",
          label: {
            borderColor: "#775DD0",
            style: {
              color: "#fff",
              background: "#775DD0",
            },
            text: "The Launch of Station",
          },
        },
      ],
    },
  },
  data() {
    return {
      series: [
        {
          data: this.dataSeries,
        },
      ],
      chartOptions: {
        chart: {
          id: "area-datetime",
          type: this.typeChart,
          zoom: {
            autoScaleYaxis: true,
          },
        },
        colors: [
          "#3B93A5",
          "#F7B844",
          "#ADD8C7",
          "#EC3C65",
          "#CDD7B6",
          "#C1F666",
          "#D43F97",
          "#1E5D8C",
          "#421243",
          "#7F94B0",
          "#EF6537",
          "#C0ADDB",
        ],
        plotOptions: {
          bar: {
            colors: {
              ranges: [
                {
                  from: -9999999999,
                  to: 0,
                  color: "#F15B46",
                },
              ],
            },
            columnWidth: "80%",
          },
        },
        grid: {
          show: false,
        },
        annotations: {
          xaxis: this.aXaxis,
        },
        title: {
          text: this.title,
          align: "left",
          margin: 20,
          offsetX: 0,
          offsetY: 0,
          floating: false,
          style: {
            fontSize: "1em",
            fontWeight: "bold",
            fontFamily: undefined,
            color: this.$store.state.theme === "dark" ? "white" : "black",
          },
        },
        dataLabels: {
          enabled: this.dataLabels,
        },
        markers: {
          size: 0,
          style: "hollow",
        },
        xaxis: {
          type: "datetime",
          // min: new Date(this.dataSeries[0][0]).getTime(),
          tickAmount: 6,
          labels: {
            style: {
              colors: this.$store.state.theme === "dark" ? "white" : "black",
            },
          },
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              return Intl.NumberFormat("en", { notation: "compact" }).format(
                value
              );
            },
            style: {
              colors: this.$store.state.theme === "dark" ? "white" : "black",
            },
          },
        },
        tooltip: {
          x: {
            format: "dd MMM yyyy",
          },
        },
        fill:
          this.typeChart === "area"
            ? {
                type: "gradient",
                gradient: {
                  shadeIntensity: 1,
                  opacityFrom: 0.7,
                  opacityTo: 0.1,
                  stops: [0, 100],
                },
              }
            : {},
      },
    };
  },
  mounted() {},
};
</script>
