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
import { UPDATE_CHANNEL_BY_EMPLOYEE } from '../../../graphql/mutations/channel/updateChannel';

const { API_URL } = process.env;

const EmployeeChannelPage = ({ chid, channel }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [employeeStatus, setEmployeeStatus] = useState();

  const [approveModal, setApproveModal] = useState(false);
  const toggleApproveModal = () => {
    setApproveModal(!approveModal);
  };

  const [unApproveModal, setUnApproveModal] = useState(false);
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

  const [requestUpdateChannelByEmployeeMutation] = useMutation(
    UPDATE_CHANNEL_BY_EMPLOYEE,
    {
      variables: {
        id: chid,
        status: employeeStatus,
        employeeNote: note.note,
      },
    }
  );

  const handleEmployeeAcceptChannel = async (approved) => {
    await setEmployeeStatus(approved);
    try {
      await requestUpdateChannelByEmployeeMutation();
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
              placeholder='comment...'
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
                handleEmployeeAcceptChannel(true);
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
              placeholder='comment...'
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
                handleEmployeeAcceptChannel(false);
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
    <Card className='single-card col-md-6 offset-md-3'>
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
          <CardSubtitle>Reason of Employee:</CardSubtitle>
          <CardText>{channel.employeeNote}</CardText>
        </>
      ) : (
        ''
      )}
      {channel.adminConfirm == false ? (
        <>
          <CardSubtitle>Reason of Admin:</CardSubtitle>
          <CardText>{channel.adminNote}</CardText>
        </>
      ) : (
        ''
      )}
      {channel.employeeConfirm === null ? (
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

export default EmployeeChannelPage;
