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
        enqueueSnackbar('Đã chấp thuận channel!', { variant: 'success' });
      } else enqueueSnackbar('Đã từ chối channel!', { variant: 'success' });
      Router.push('/dashboard');
    } catch (e) {
      console.log(e);
      enqueueSnackbar('Đã có lỗi xảy ra, vui lòng thử lại!', {
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
              Bạn có thật sự muốn duyệt Channel này? Hãy để lại nhận xét:
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
            Hủy
          </Button>
          <Button
            color='primary'
            disabled={note.note == null ? true : false}
            onClick={() => {
              try {
                handleEmployeeAcceptChannel(true);
              } catch (error) {
                enqueueSnackbar('Đã có lỗi xảy ra, vui lòng thử lại!', {
                  variant: 'error',
                });
              }
              toggleApproveModal();
            }}
          >
            Xác nhận
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
            <strong>Từ chối Channel</strong>
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
              Bạn có thật sự muốn từ chối Channel này? Hãy để lại nhận xét:
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
            Hủy
          </Button>
          <Button
            color='primary'
            disabled={note.note == null ? true : false}
            onClick={() => {
              try {
                handleEmployeeAcceptChannel(false);
              } catch (error) {
                enqueueSnackbar('Đã có lỗi xảy ra, vui lòng thử lại!', {
                  variant: 'error',
                });
              }
              toggleUnApproveModal();
            }}
          >
            Xác nhận
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
      return 'Đang chờ cấp phép';
    }
    if (!employeeConfirm || !adminConfirm) {
      return 'Không được cấp phép';
    }
    if (adminConfirm && employeeConfirm && status == false) {
      return 'Đã được cấp phép - Đang dừng hoạt động';
    }
    if (adminConfirm && employeeConfirm && status == true) {
      return 'Đã được cấp phép - Đang hoạt động';
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
        <strong>Thể loại:</strong>
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
        <strong>Số điện thoại:</strong>
      </CardSubtitle>
      <CardText>{channel.phone}</CardText>
      <CardSubtitle>
        <strong>Mức giá:</strong>
      </CardSubtitle>
      <CardText>{channel.price}</CardText>
      <CardSubtitle>
        <strong>Trạng thái:</strong>
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
          <CardSubtitle>Lý do:</CardSubtitle>
          <CardText>{channel.employeeNote}</CardText>
        </>
      ) : (
        ''
      )}
      {channel.adminConfirm == false ? (
        <>
          <CardSubtitle>Lý do:</CardSubtitle>
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
            Từ chối
          </Button>
          <Button color='primary' onClick={toggleApproveModal}>
            Xác nhận
          </Button>
        </div>
      ) : (
        ''
      )}
    </Card>
  );
};

export default EmployeeChannelPage;
