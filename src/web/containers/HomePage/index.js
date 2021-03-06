/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import messages from 'core/HomePage/messages';
import { createStructuredSelector } from 'reselect';

import {
  selectRepos,
  selectLoading,
  selectError,
  selectCurrentUser
} from 'core/App/selectors';

import {
  selectUsername
} from 'core/HomePage/selectors';

import { changeUsername } from 'core/HomePage/actions';
import { loadRepos } from 'core/App/actions';

import RepoListItem from 'web/components/RepoListItem';
import List from 'web/components/List';
import ListItem from 'web/components/ListItem';
import LoadingIndicator from 'web/components/LoadingIndicator';

import styles from './styles.css';

export const HomePage = (props) => {
  const { username, loading, error, repos, currentUser, onSubmitForm, onChangeUsername } = props;

  let mainContent = null;

  // Show a loading indicator when we're loading
  if (loading) {
    mainContent = (<List component={LoadingIndicator} />);

  // Show an error if there is one
  } else if (error !== false) {
    const ErrorComponent = () => (
      <ListItem item={'Something went wrong, please try again!'} />
    );
    mainContent = (<List component={ErrorComponent} />);

  // If we're not loading, don't have an error and there are repos, show the repos
  } else if (repos !== false) {
    mainContent = (<List items={repos} currentUser={currentUser} component={RepoListItem} />);
  }

  return (
    <article>
      <Helmet
        title="Home Page"
        meta={[
          { name: 'description', content: 'A React.js Boilerplate application homepage' },
        ]}
      />
      <div>
        <section className={`${styles.textSection} ${styles.centered}`}>
          <h2>
           {messages.startProjectHeader}
          </h2>
          <p>
            {messages.startProjectMessage}
          </p>
        </section>
        <section className={styles.textSection}>
          <h2>
            {messages.trymeHeader}
          </h2>
          <form className={styles.usernameForm} onSubmit={onSubmitForm}>
            <label htmlFor="username">
              {messages.trymeMessage}
              <span className={styles.atPrefix}>
                {messages.trymeAtPrefix}
              </span>
              <input
                id="username"
                className={styles.input}
                type="text"
                placeholder="lukemarsh"
                value={username}
                onChange={onChangeUsername}
              />
            </label>
          </form>
          {mainContent}
        </section>
      </div>
    </article>
  );
};

HomePage.propTypes = {
  loading: React.PropTypes.bool,
  error: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  repos: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool,
  ]),
  currentUser: React.PropTypes.oneOfType([
    React.PropTypes.bool,
    React.PropTypes.string
  ]),
  onSubmitForm: React.PropTypes.func,
  username: React.PropTypes.string,
  onChangeUsername: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onChangeUsername: (evt) => dispatch(changeUsername(evt.target.value)),
    onSubmitForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(loadRepos());
    },

    dispatch,
  };
}

const mapStateToProps = createStructuredSelector({
  repos: selectRepos(),
  username: selectUsername(),
  loading: selectLoading(),
  error: selectError(),
  currentUser: selectCurrentUser()
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
