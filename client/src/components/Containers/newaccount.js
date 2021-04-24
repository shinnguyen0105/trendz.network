import React, { useEffect } from 'react';
import { Card, Container, CardTitle, CardText, Button } from 'reactstrap';
import { useAuth } from '../../contexts/userContext';
import Router from 'next/router';

import { useMutation } from 'react-apollo';
import { REQUEST_UPDATE_ROLE } from '../../graphql/mutations/authentication/updateRole';
export const LOGOUT = 'LOGOUT';

import { useSnackbar } from 'notistack';

const NewAccount = () => {
  const { state, dispatch } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    if (state.jwt === '' || state.user.role.name !== 'Authenticated')
      Router.push('/login');
  }, [state]);

  const [requestUpdateRole, { loading: requestUpdateLoading }] = useMutation(
    REQUEST_UPDATE_ROLE
  );

  const handleRoleChange = async (roleId) => {
    try {
      await requestUpdateRole({
        variables: {
          userId: state.user.id,
          role: roleId,
        },
      });
      localStorage.removeItem('userInfo');
      dispatch({ type: LOGOUT });
      Router.push('/login');
      enqueueSnackbar('Update role successfully, Please login again!', {
        variant: 'success',
      });
    } catch (e) {
      console.log(e);
      enqueueSnackbar('Error when change role!', {
        variant: 'error',
      });
    }
    return;
  };

  return (
    <div className='main'>
      <br />
      <br />
      <Card>
        <Container>
          <Card className='single-card'>
            <CardTitle>Welcome to Trendz Network</CardTitle>
            <br />
            <CardText>Do you want to be: </CardText>
            <Button
              disabled={requestUpdateLoading}
              onClick={() => handleRoleChange(3)}
              color='secondary'
            >
              A Customer{' '}
            </Button>
            <Button
              disabled={requestUpdateLoading}
              onClick={() => handleRoleChange(5)}
              color='primary'
            >
              A Influencer{' '}
            </Button>
          </Card>
        </Container>
      </Card>
    </div>
  );
};

export default NewAccount;
