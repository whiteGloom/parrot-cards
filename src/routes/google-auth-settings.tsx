import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useGoogleOauthStore } from '../stores/googleOauthStore.ts';
import { Formik } from 'formik';
import { Button, ButtonTheme } from '../widgets/buttons';
import { ArrowLeft } from 'lucide-react';
import { PageContentWrapper } from '../widgets/wrappers/page-content-wrapper.tsx';

export const Route = createFileRoute('/google-auth-settings')({
  component: Index,
});

function Index() {
  const oauthStore = useGoogleOauthStore();
  const navigate = useNavigate();

  return (
    <PageContentWrapper>
      <>
        <div className="flex gap-4 items-center">
          <Button
            className="self-start"
            theme={ButtonTheme.secondary}
            onClick={() => {
              navigate({
                to: '/import',
              }).catch(null);
            }}
          >
            <ArrowLeft />
          </Button>
          <h1 className="text-2xl text-purple-800">Google OAuth Settings</h1>
        </div>

        <Formik
          initialValues={{
            clientId: oauthStore.oauthSettings?.clientId || '',
            keepMeLoggedIn: oauthStore.oauthSettings?.keepMeLoggedIn || false,
          }}
          onSubmit={(values) => {
            oauthStore.setOauthSettings({
              clientId: values.clientId.trim(),
              keepMeLoggedIn: values.keepMeLoggedIn,
            });
          }}
          validate={(values) => {
            const errors: Partial<typeof values> = {};
            if (!values.clientId.trim()) {
              errors.clientId = 'Required';
            }
            return errors;
          }}
        >
          {({ handleSubmit, handleChange, values }) => (
            <form onSubmit={handleSubmit} className="border border-gray-200 bg-white rounded p-3 flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <label htmlFor="googleOauth:clientId" className="text-sm text-gray-700">
                  Client ID:
                </label>
                <input
                  id="googleOauth:clientId"
                  type="text"
                  name="clientId"
                  value={values.clientId}
                  onChange={handleChange}
                  placeholder="Enter your Google OAuth Client ID"
                  className="border p-1 rounded border-gray-400 shadow bg-white"
                />
              </div>
              <label
                htmlFor="googleOauth:keepMeLoggedIn"
                className="text-sm text-gray-700 flex gap-1"
              >
                <input
                  id="googleOauth:keepMeLoggedIn"
                  type="checkbox"
                  name="keepMeLoggedIn"
                  checked={values.keepMeLoggedIn}
                  onChange={handleChange}
                  className="border p-1
                "
                />
                Keep me logged in
              </label>
              <Button
                theme={oauthStore.oauthSettings?.clientId ? ButtonTheme.secondary : ButtonTheme.primary}
                type="submit"
              >
                Save
              </Button>
            </form>
          )}
        </Formik>
        {oauthStore.oauthSettings?.clientId
          ? (
              <Button
                theme={oauthStore.authorizationData?.state === 'error' ? ButtonTheme.warning : ButtonTheme.primary}
                type="submit"
                isLoading={oauthStore.authorizationData.state === 'inProgress'}
                onClick={async () => {
                  oauthStore.authorize().catch(null);
                }}
                hint={oauthStore.authorizationData.state === 'error' ? `Error: ${oauthStore.authorizationData.errorInfo.error}` : undefined}
                disabled={oauthStore.authorizationData.state === 'inProgress' || oauthStore.authorizationData.state === 'authorized'}
              >
                {oauthStore.authorizationData.state === 'authorized' ? 'You are authorized' : 'Login'}
              </Button>
            )
          : <p className="mt-4 text-red-500">Google App's Client ID isn't set</p>}
      </>
    </PageContentWrapper>
  );
}
