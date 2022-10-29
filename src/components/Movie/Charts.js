import React, { useState, useEffect } from 'react'
import ApexCharts from 'react-apexcharts'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const Charts = ({ detailInfo }) => {
  const {
    kofic: { audiChange },
  } = detailInfo //전일 대비 관객수 증감 비율
  const {
    kofic: { salesShare },
  } = detailInfo //해당일자 매출총액 대비 매출비율
  const {
    kofic: { salesChange },
  } = detailInfo //전일 대비 매출액 증감 비율

  const {
    kofic: { audiCnt },
  } = detailInfo //해당일 관객 수
  const {
    kofic: { audiAcc },
  } = detailInfo //누적관객수

  const {
    kofic: { rankInten },
  } = detailInfo //전일대비 순위 증감분
  const {
    kofic: { rank },
  } = detailInfo //오늘 랭킹

  const first = {
    series: [
      {
        name: 'Series 1',
        data: [audiChange, salesShare, salesChange],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: 'radar',
      },
      title: {
        text: '',
      },
      xaxis: {
        categories: [
          '전일 대비 관객수 증감 비율',
          '해당일자 매출총액 대비 매출비율',
          '전일 대비 매출액 증감 비율',
        ],
      },
    },
  }

  const second = {
    series: [
      {
        name: 'Inflation',
        data: [audiCnt, audiAcc],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          dataLabels: {
            position: 'top', // top, center, bottom
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return ('' + val).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,') + '명'
        },
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ['#304758'],
        },
      },

      xaxis: {
        categories: ['당일 관객 수', '누적 관객 수'],
        position: 'top',
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            },
          },
        },
        tooltip: {
          enabled: true,
        },
      },
      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          formatter: function (val) {
            return val
          },
        },
      },
      title: {
        text: '관객 수',
        floating: true,
        offsetY: 330,
        align: 'center',
        style: {
          color: '#444',
        },
      },
    },
  }

  const makeDate = () => {
    let today = new Date()
    let year = today.getFullYear() // 년도
    let month =
      ('' + (today.getMonth() + 1)).length === 1
        ? '0' + (today.getMonth() + 1)
        : today.getMonth() + 1 // 월
    let date =
      ('' + (today.getDate() - 1)).length === 1
        ? '0' + (today.getDate() - 1)
        : '' + today.getDate() - 1 // 날짜

    return [month, date]
  }

  const third = {
    series: [
      {
        name: '전일대비 순위',
        data: [parseInt(rank - rankInten), parseInt(rank)],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
      },
      title: {
        text: '전일 대비 영화 랭킹',
        align: 'center',
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: [
          `${makeDate()[0]}/${makeDate()[1] - 1}`,
          `${makeDate()[0]}/${makeDate()[1]}`,
        ],
      },
    },
  }

  return (
    <div>
      <Container>
        <Row>
          <Col xs={12} md={12} lg={4}>
            <ApexCharts
              options={first.options}
              series={first.series}
              type="radar"
              height={470}
              width={500}
            />
          </Col>
          <Col xs={12} md={12} lg={4}>
            <ApexCharts
              options={second.options}
              series={second.series}
              type="bar"
              height={350}
              width={450}
            />
          </Col>
          <Col xs={12} md={12} lg={4}>
            <ApexCharts
              options={third.options}
              series={third.series}
              type="line"
              height={350}
              width={450}
            />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Charts
