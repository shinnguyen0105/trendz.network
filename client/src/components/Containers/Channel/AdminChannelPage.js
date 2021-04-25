import { useAuth } from '../../../contexts/userContext';
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
  Input,
} from 'reactstrap';
import { useSnackbar } from 'notistack';
import Router from 'next/router';

import { useMutation } from 'react-apollo';
import { UPDATE_CHANNEL_BY_ADMIN } from '../../../graphql/mutations/channel/updateChannel';
const { API_URL } = process.env;

const AdminCampaignPage = ({ chid, channel }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [adminConfirmTemp, setAdminConfirmTemp] = useState();
  const [statusTemp, setStatusTemp] = useState();

  const [approveModal, setApproveModal] = useState(false);
  const [unApproveModal, setUnApproveModal] = useState(false);

  const toggleApproveModal = () => {
    setApproveModal(!approveModal);
  };
  const toggleUnApproveModal = () => {
    setUnApproveModal(!unApproveModal);
  };

  const [note, setNote] = useState({
    note: null,
  });
  const handleNoteChange = (event) => {
    event.preventDefault();
    const { value } = event.target;
    setNote((previousState) => {
      return { ...previousState, note: value };
    });
  };

  const [requestUpdateChannelByAdminMutation] = useMutation(
    UPDATE_CHANNEL_BY_ADMIN,
    {
      variables: {
        id: chid,
        adminConfirm: adminConfirmTemp,
        status: statusTemp,
        adminNote: note.note,
      },
    }
  );

  const handleAdminAcceptChannel = async (approved) => {
    await setAdminConfirmTemp(approved);
    await setStatusTemp(approved);
    try {
      await requestUpdateChannelByAdminMutation();
      if (approved) {
        enqueueSnackbar('Approved channel!', { variant: 'success' });
      } else enqueueSnackbar('Rejected the channel!', { variant: 'success' });
      Router.push('/dashboard');
    } catch (e) {
      console.log(e);
      enqueueSnackbar('An error has occurred, please try again!', {
        variant: 'error',
      });
    }
    return;
  };

  const renderApproveModal = () => {
    return (
      <Modal isOpen={approveModal} toggle={toggleApproveModal}>
        <div className='modal-header'>
          <h4 className='modal-title' id='avatarModal'>
            <strong>Duyệt Channel</strong>
          </h4>
          <button
            type='button'
            className='close'
            data-dismiss='modal'
            aria-hidden='true'
            onClick={() => {
              setNote({ note: null });
              toggleApproveModal();
            }}
          >
            <i className='tim-icons icon-simple-remove' />
          </button>
        </div>
        <ModalBody>
          <FormGroup className='modal-items'>
            <Label>
              Do you really want to approve this Channel? Leave a comment:
            </Label>
            <Input
              type='textarea'
              id='content'
              placeholder='Nhận xét...'
              name='content'
              onChange={handleNoteChange}
              value={note.note != null ? note.note : ''}
              required
              className='modal-items'
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color='secondary'
            onClick={() => {
              setNote({ note: null });
              toggleApproveModal();
            }}
          >
            Cancel
          </Button>
          <Button
            color='primary'
            disabled={note.note == null ? true : false}
            onClick={() => {
              try {
                handleAdminAcceptChannel(true);
              } catch (error) {
                enqueueSnackbar('An error has occurred, please try again!', {
                  variant: 'error',
                });
              }
              toggleApproveModal();
            }}
          >
            Confirm
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  const renderUnApproveModal = () => {
    return (
      <Modal isOpen={unApproveModal} toggle={toggleUnApproveModal}>
        <div className='modal-header'>
          <h4 className='modal-title' id='avatarModal'>
            <strong>Decline Channel</strong>
          </h4>
          <button
            type='button'
            className='close'
            data-dismiss='modal'
            aria-hidden='true'
            onClick={() => {
              setNote({ note: null });
              toggleUnApproveModal();
            }}
          >
            <i className='tim-icons icon-simple-remove' />
          </button>
        </div>
        <ModalBody>
          <FormGroup className='modal-items'>
            <Label>
              Do you really want this Decline Channel? Leave a comment:
            </Label>
            <Input
              type='textarea'
              id='content'
              placeholder='Nhận xét...'
              name='content'
              onChange={handleNoteChange}
              value={note.note != null ? note.note : ''}
              required
              className='modal-items'
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color='secondary'
            onClick={() => {
              setNote({ note: null });
              toggleApproveModal();
            }}
          >
            Cancel
          </Button>
          <Button
            color='primary'
            disabled={note.note == null ? true : false}
            onClick={() => {
              try {
                handleAdminAcceptChannel(false);
              } catch (error) {
                enqueueSnackbar('An error has occurred, please try again!', {
                  variant: 'error',
                });
              }
              toggleUnApproveModal();
            }}
          >
            Confirm
          </Button>
        </ModalFooter>
      </Modal>
    );
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

  return (
    <Card className='single-card'>
      {renderApproveModal()}
      {renderUnApproveModal()}
      <CardImg
        src={
          channel.avatar.formats !== null
            ? `${API_URL}${channel.avatar.formats.thumbnail.url}`
            : `${API_URL}${channel.avatar.url}`
        }
        alt='Card image cap'
        className='campaign-detail-img'
      />
      <CardTitle>{channel.name}</CardTitle>
      <CardSubtitle>{channel.description}</CardSubtitle>
      <CardSubtitle>
        <strong>Category:</strong>
      </CardSubtitle>
      {channel.category !== undefined ? (
        <CardText>
          {channel.category.name}
          <br />
          {channel.category.description}
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
      <CardText>{channel.price}</CardText>
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
      {channel.adminConfirm === null ? (
        <div className='form-button'>
          <Button
            className='btn-neutral'
            color='primary'
            onClick={toggleUnApproveModal}
          >
            Reject
          </Button>
          <Button color='primary' onClick={toggleApproveModal}>
            Approve
          </Button>
        </div>
      ) : (
        ''
      )}
    </Card>
  );
};

export default AdminCampaignPage;
