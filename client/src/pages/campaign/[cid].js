import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/userContext';
import { useQuery } from 'react-apollo';

import Router from 'next/router';
import axios from 'axios';
import { Card, CardBody } from 'reactstrap';

import { CircularProgress } from '@material-ui/core';

import Influencer from '../../components/Containers/Campaigns/Influencer';
import Customer from '../../components/Containers/Campaigns/Customer';
import Employee from '../../components/Containers/Campaigns/Employee';

import Skeleton from '@material-ui/lab/Skeleton';

import { REQUEST_GET_DETAIL_CAMPAIGNS_BY_ID } from '../../graphql/query/campaign/getCampaigns';
const { API_URL } = process.env;

const Campaign = ({ cid }) => {
  const { state } = useAuth();
  function CampaignDetail() {
    const { loading, error, data } = useQuery(
      REQUEST_GET_DETAIL_CAMPAIGNS_BY_ID,
      {
        variables: {
          id: parseInt(cid),
        },
      }
    );
    if (loading)
      return (
        <Card>
          <CardBody>
            <Skeleton variant='text' />
          </CardBody>
        </Card>
      );
    else if (error) {
      console.log(error);
      return null;
    } else {
      if (state.user.id == data.campaign.channels[0].user.id) {
        return <Influencer campaign={data.campaign} cid={cid} />;
      } else if (state.user.id == data.campaign.user.id) {
        return <Customer campaign={data.campaign} cid={cid} />;
      } else if (state.user.role.name == 'Employee') {
        return <Employee campaign={data.campaign} cid={cid} />;
      }
    }
  }

  return (
    <div className='wrapper'>
      <div className='main'>
        <Card>
          <CardBody>
            <CampaignDetail />
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export async function getStaticPaths() {
  const campaignIdsUrl = API_URL + '/campaigns/getId';
  const get_resolve = await axios.get(campaignIdsUrl);
  const campaignIds = get_resolve.data;
  const paths = campaignIds.map((campaignId) => ({
    params: { cid: campaignId.id.toString() },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const cid = params.cid;
  return {
    props: { cid },
  };
}

export default Campaign;
