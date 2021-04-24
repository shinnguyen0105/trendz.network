import React from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/userContext';
import { useQuery } from 'react-apollo';
import { Card, CardBody } from 'reactstrap';

import InfluencerChannelPage from '../../components/Containers/Channel/InfluencerChannelPage';
import EmployeeChannelPage from '../../components/Containers/Channel/EmployeeChannelPage';
import AdminChannelPage from '../../components/Containers/Channel/AdminChannelPage';
import CustomerChannelPage from '../../components/Containers/Channel/CustomerChannelPage';
import { Skeleton } from '@material-ui/lab';
import { REQUEST_GET_CHANNEL_DETAILS } from '../../graphql/query/channel/getChannels';

const { API_URL } = process.env;

const Channel = ({ chid }) => {
  const { state } = useAuth();

  function ChannelDetail() {
    const { loading, error, data } = useQuery(REQUEST_GET_CHANNEL_DETAILS, {
      variables: {
        channelID: chid,
      },
    });
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
      console.log(data);
      if (state.user.id == data.channel.user.id) {
        return <InfluencerChannelPage channel={data.channel} chid={chid} />;
      } else if (state.user.role.name == 'Employee') {
        return <EmployeeChannelPage channel={data.channel} chid={chid} />;
      } else if (state.user.role.name == 'Admin') {
        return <AdminChannelPage channel={data.channel} chid={chid} />;
      } else return <CustomerChannelPage channel={data.channel} />;
    }
  }

  return (
    <div className='wrapper'>
      <div className='main'>
        <Card>
          <CardBody>
            <ChannelDetail />
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export async function getStaticPaths() {
  const channelIdsUrl = API_URL + '/channels/getId';
  const get_resolve = await axios.get(channelIdsUrl);
  const channelIds = get_resolve.data;
  const paths = channelIds.map((channelId) => ({
    params: { chid: channelId.id.toString() },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const chid = params.chid;
  return {
    props: { chid },
  };
}

export default Channel;
