import React from 'react';
import {
  Card,
  CardBody,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
  CardDeck,
} from 'reactstrap';

import Skeleton from '@material-ui/lab/Skeleton';

import { Bar } from 'react-chartjs-2';

import { useQuery } from 'react-apollo';
import { REQUEST_ALL_CHANNELS_TO_COUNT } from '../graphql/query/channel/getChannels';
import { REQUEST_GET_ALL_CAMPAIGNS_TO_COUNT } from '../graphql/query/campaign/getCampaigns';
import { REQUEST_GET_ALL_INFLUENCERS_TO_COUNT } from '../graphql/query/influencer/getInfluencers';
import { REQUEST_GET_TOP_INFLUENCERS } from '../graphql/query/influencer/getInfluencers';

function dataChartJs(labels, labech, data) {
  return {
    labels: labels,
    datasets: [
      {
        label: labech,
        data: data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderWidth: 3,
      },
    ],
  };
}
function optionsChartJs(text) {
  var options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
    title: {
      display: true,
      text: text,
      fontSize: 25,
    },
    legend: {
      display: true,
      position: 'top',
    },
  };
  return options;
}
const ChartForAdmin = () => {
  function GetChannels() {
    const { loading, error, data } = useQuery(REQUEST_ALL_CHANNELS_TO_COUNT);
    if (loading) return <Skeleton variant='text' />;
    if (error) return null;
    let channelsCount = data.channels.length;
    //console.log(channelsCount);
    return (
      <>
        <div className='m-4 ml-6 col-11 col-md-3 bg-secondary rounded shadow'>
          <div className='statistic-card'>
            <h2 className='text-dark pt-4 text-center mb-2'>CHANNELS</h2>
            <h3 className='text-dark text-statistic text-center'>
              {channelsCount}
            </h3>
          </div>
        </div>
      </>
    );
  }
  function GetCampaigns() {
    const { loading, error, data } = useQuery(
      REQUEST_GET_ALL_CAMPAIGNS_TO_COUNT
    );
    if (loading) return <Skeleton variant='text' />;
    if (error) return null;
    let campaignCount = data.campaigns.length;
    //console.log(campaignCount);
    return (
      <>
        <div className='m-4 ml-6 col-11 col-md-3 bg-secondary rounded shadow'>
          <div className='statistic-card'>
            <h2 className='text-dark pt-4 text-center mb-2'>CAMPAIGNS</h2>
            <h3 className='text-dark text-statistic text-center'>
              {campaignCount}
            </h3>
          </div>
        </div>
      </>
    );
  }

  function ChartCampaigns() {
    const { loading, error, data } = useQuery(
      REQUEST_GET_ALL_CAMPAIGNS_TO_COUNT
    );
    if (loading) return <Skeleton variant='text' />;
    if (error) return null;
    let campaigns = data.campaigns.map((c) => c.created_at);
    const monthCountArr = new Array(12).fill(0);
    campaigns.forEach(
      (date) => (monthCountArr[new Date(date).getMonth()] += 1)
    );
    var months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return (
      <>
        <div className='m-4 ml-6 col-11 col-md-5 bg-secondary rounded shadow'>
          <div className='chart-card'>
            <Bar
              data={dataChartJs(months, 'Monthly', monthCountArr)}
              options={optionsChartJs('Number of monthly campaigns')}
            />
          </div>
        </div>
      </>
    );
  }
  function ChartInfluencer() {
    const { loading, error, data } = useQuery(REQUEST_GET_TOP_INFLUENCERS);
    if (loading) return <Skeleton variant='text' />;
    if (error) return null;

    let channelsWithInfluencer = data.campaigns.map((x) => x.channels);
    let destructorChannelsWithInfluencer = [];
    for (let i = 0; i < channelsWithInfluencer.length; i++) {
      destructorChannelsWithInfluencer.push(channelsWithInfluencer[i][0]);
    }
    //destructor array in array
    var ListInfluencer = destructorChannelsWithInfluencer.map(
      (x) => x.user.name
    );
    //map list influencer
    let counts = {};
    for (let i = 0; i < ListInfluencer.length; i++) {
      if (counts[ListInfluencer[i]]) {
        counts[ListInfluencer[i]] += 1;
      } else {
        counts[ListInfluencer[i]] = 1;
      }
    }
    //return object but i want to convert to array
    let sortable = [];
    for (let vehicle in counts) {
      sortable.push([vehicle, counts[vehicle]]);
    }
    sortable.sort(function (a, b) {
      return a[0] - b[0];
    });
    //return 2D array has been sorted with name influencer an number of their campaigns
    let nameTopInfluencer = sortable.map(function (tuple) {
      return tuple[0];
    });
    let dataTopInfluencer = sortable.map(function (tuple) {
      return tuple[1];
    });
    //split 2D array
    return (
      <>
        <div className='m-4 ml-6 col-11 col-md-5 bg-secondary rounded shadow'>
          <div className='chart-card'>
            <Bar
              data={dataChartJs(
                nameTopInfluencer.slice(0, 4),
                'Influencer',
                dataTopInfluencer.slice(0, 4)
              )}
              options={optionsChartJs('Top 5 Influencer')}
            />
          </div>
        </div>
      </>
    );
  }
  function GetInfluencers() {
    const { loading, error, data } = useQuery(
      REQUEST_GET_ALL_INFLUENCERS_TO_COUNT
    );
    if (loading) return <Skeleton variant='text' />;
    if (error) return null;
    let influencerCount = data.users.length;
    return (
      <>
        <div className='m-4 ml-6 col-11 col-md-3 bg-secondary rounded shadow'>
          <div className='statistic-card'>
            <h2 className='text-dark pt-4 text-center mb-2'>INFLUENCERS</h2>
            <h3 className='text-dark text-statistic text-center'>
              {influencerCount}
            </h3>
          </div>
        </div>
      </>
    );
  }
  return (
    <Row>
      <CardDeck className='w-100 d-flex justify-content-md-around justify-content-between wrap'>
        <GetCampaigns />
        <GetInfluencers />
        <GetChannels />
      </CardDeck>
      <CardDeck className='w-100 d-flex justify-content-md-around justify-content-between wrap'>
        <ChartCampaigns />
        <ChartInfluencer />
      </CardDeck>
    </Row>
  );
};

export default ChartForAdmin;
