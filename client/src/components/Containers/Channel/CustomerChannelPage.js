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
    </Card>
  );
};

export default CustomerChannelPage;
