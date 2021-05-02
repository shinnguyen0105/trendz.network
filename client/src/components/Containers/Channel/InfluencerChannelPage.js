import React, { useState } from 'react';
import {
  Button,
  Card,
  CardImg,
  CardSubtitle,
  CardTitle,
  CardText,
  Modal,
  ModalBody,
  ModalFooter,
  Label,
  FormGroup,
} from 'reactstrap';
import { useSnackbar } from 'notistack';

import { useMutation } from 'react-apollo';
import { UPDATE_CHANNEL_BY_INFLUENCER } from '../../../graphql/mutations/channel/updateChannel';

const { API_URL } = process.env;

const InfluencerChannelPage = ({ chid, channel }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [statusModal, setStatusModal] = useState(false);
  const toggleStatusModal = () => {
    setStatusModal(!statusModal);
  };

  const [requestUpdateChannelStatusMutation] = useMutation(
    UPDATE_CHANNEL_BY_INFLUENCER,
    {
      update(cache, { data: { updateChannel } }) {
        cache.modify({
          id: cache.identify(chid),
          fields: {
            channel() {
              const newChannelRef = cache.writeFragment({
                data: updateChannel.channel,
                fragment: UPDATE_CHANNEL_FRAGMENT,
              });
              return newChannelRef;
            },
          },
        });
      },
    }
  );
  const handleChangeStatusChannel = async (status) => {
    try {
      await requestUpdateChannelStatusMutation({
        variables: {
          id: chid,
          status: status,
        },
      });
    } catch (e) {
      console.log(e);
    }
  };

  const renderStatus = (employeeConfirm, adminConfirm, status) => {
    if (
      employeeConfirm == null ||
      (employeeConfirm == true && adminConfirm == null)
    ) {
      return 'Waiting for licensing';
    }
    if (!employeeConfirm || !adminConfirm) {
      return 'Not licensed';
    }
    if (adminConfirm && employeeConfirm && status == false) {
      return 'Licensed - Inactive';
    }
    if (adminConfirm && employeeConfirm && status == true) {
      return 'Licensed - In operation';
    }
  };

  const renderStatusModal = () => {
    return (
      <Modal isOpen={statusModal} toggle={toggleStatusModal}>
        <div className='modal-header'>
          <h4 className='modal-title' id='avatarModal'>
            {channel.status === true ? (
              <strong>Deactivate the Channel</strong>
            ) : (
              <strong>Activate the Channel</strong>
            )}
          </h4>
          <button
            type='button'
            className='close'
            data-dismiss='modal'
            aria-hidden='true'
            onClick={toggleStatusModal}
          >
            <i className='tim-icons icon-simple-remove' />
          </button>
        </div>
        <ModalBody>
          <FormGroup className='modal-items'>
            {channel.status === true ? (
              <Label>Do you really want to deactivate this channel?</Label>
            ) : (
              <Label>Do you really want to activate this channel?</Label>
            )}
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color='secondary' onClick={toggleStatusModal}>
            Cancel
          </Button>
          {channel.status === true ? (
            <Button
              color='primary'
              onClick={() => {
                try {
                  handleChangeStatusChannel(false);
                  enqueueSnackbar('Channel has stopped working!', {
                    variant: 'success',
                  });
                } catch (error) {
                  enqueueSnackbar('Channel status change failed!', {
                    variant: 'error',
                  });
                }
                toggleStatusModal();
              }}
            >
              Confirm
            </Button>
          ) : (
            <Button
              color='primary'
              onClick={() => {
                try {
                  handleChangeStatusChannel(true);
                  enqueueSnackbar('Channel is activated!', {
                    variant: 'success',
                  });
                } catch (error) {
                  enqueueSnackbar('Channel status change failed!', {
                    variant: 'error',
                  });
                }
                toggleStatusModal();
              }}
            >
              Có
            </Button>
          )}
        </ModalFooter>
      </Modal>
    );
  };
  return (
    <Card className='single-card col-md-6 offset-md-3'>
      {channel.status !== null ? renderStatusModal() : ''}
      <CardImg
        src={
          channel.avatar !== null
            ? channel.avatar.formats.medium === undefined
              ? `${API_URL}${channel.avatar.url}`
              : `${API_URL}${channel.avatar.formats.medium.url}`
            : `/256x186.svg`
        }
        alt='Avatar of Channel'
        className='campaign-detail-img'
      />
      <CardTitle>{channel.name}</CardTitle>
      <CardSubtitle>{channel.description}</CardSubtitle>
      <CardSubtitle>
        <strong>Category:</strong>
      </CardSubtitle>
      {channel.category !== undefined ? (
        <CardText>
          {channel.category.name} - {channel.category.description}
        </CardText>
      ) : (
        ''
      )}
      <CardSubtitle>
        <strong>Website:</strong>
      </CardSubtitle>
      <CardText>{channel.website}</CardText>
      <CardSubtitle>
        <strong>Phone number:</strong>
      </CardSubtitle>
      <CardText>{channel.phone}</CardText>
      <CardSubtitle>
        <strong>Price:</strong>
      </CardSubtitle>
      <CardText>
        {channel.price.toLocaleString('vi-VN', {
          style: 'currency',
          currency: 'VND',
        })}
      </CardText>
      <CardSubtitle>
        <strong>Status:</strong>
      </CardSubtitle>
      <CardText>
        {renderStatus(
          channel.employeeConfirm,
          channel.adminConfirm,
          channel.status
        )}
      </CardText>
      {channel.employeeConfirm == false ? (
        <>
          <CardSubtitle>Reasons:</CardSubtitle>
          <CardText>{channel.employeeNote}</CardText>
        </>
      ) : (
        ''
      )}
      {channel.adminConfirm == false ? (
        <>
          <CardSubtitle>Reasons:</CardSubtitle>
          <CardText>{channel.adminNote}</CardText>
        </>
      ) : (
        ''
      )}
      <div className='form-button'>
        {channel.status === true && channel.adminConfirm === true ? (
          <Button
            color='danger'
            onClick={() => {
              toggleStatusModal();
            }}
          >
            Deactivate
          </Button>
        ) : (
          ''
        )}
        {channel.status === false && channel.adminConfirm === true ? (
          <Button
            color='primary'
            onClick={() => {
              toggleStatusModal();
            }}
          >
            Active
          </Button>
        ) : (
          ''
        )}
      </div>
    </Card>
  );
};

export default InfluencerChannelPage;
