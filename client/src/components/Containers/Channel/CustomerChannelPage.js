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

const { API_URL } = process.env;

const CustomerChannelPage = ({ channel }) => {
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
      <CardImg
        src={
          channel.avatar.formats !== null
            ? `${API_URL}${channel.avatar.formats.medium.url}`
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
          {channel.category.name} {' - '}
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
    </Card>
  );
};

export default CustomerChannelPage;
