import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { ImageBackground, Image, View, StyleSheet } from "react-native";
import { Actions } from "react-native-router-flux";
import i18n from "i18next";
import { BodyText } from "../../components/core";
import { Button, Text } from 'native-base';
import theme from "../../themes/base-theme";
import { colors } from '../../theme';
import { isTokenLoggerApplet } from '../../services/tokens';
import {
  currentAppletSelector,
} from "../../state/app/app.selectors";
import { currentResponsesSelector } from "../../state/responses/responses.selectors";
import { nextActivity } from "../../state/responses/responses.thunks";
import TokenLoggerBackground from '../../../img/tokenlogger_background.png'

const badge = require('../../../img/badge.png');
const styles = StyleSheet.create({
  box: {
    paddingTop: 40,
    paddingHorizontal: 40,
    flex: 1,
    justifyContent: "center",
    // backgroundColor: 'white',
    fontFamily: theme.fontFamily,
  },
  nextActivity: {
    marginTop: 20,
    marginHorizontal: 20,
    padding: 25,
    borderRadius: 16,
    fontFamily: theme.fontFamily,
    alignItems: 'center',
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.grey,
  }
});

const ActivityFlowSubmit = ({ currentApplet, currentResponses, orderIndex, nextActivity }) => {
  const tokenLogger = isTokenLoggerApplet(currentApplet);
  const activityFlow = currentResponses && currentResponses.activity;
  const index = activityFlow && orderIndex[activityFlow.id] || 0;

  const onSubmit = () => {
    nextActivity(true);
  };

  const onBack = () => {
    nextActivity();
  }

  return (
    <ImageBackground
      style={{ width: "100%", height: "100%", flex: 1 }}
      source={
        tokenLogger ? TokenLoggerBackground : {
          uri: "https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80",
        }
      }
    >
      <View style={styles.box}>
        {
          !currentResponses &&
          <BodyText style={{ fontFamily: theme.fontFamily, textAlign: "center", fontWeight: '500', fontSize: 22 }}>
            Please Wait ...
          </BodyText>
          ||
          <>
            <BodyText style={{ fontFamily: theme.fontFamily, textAlign: "center" }}>
              {i18n.t("additional:submit_flow_answers")}
            </BodyText>

            <View style={styles.nextActivity}>
              <Text style={{ fontWeight: "bold", marginBottom: 10 }}>Blue Activity</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  source={badge}
                  style={{
                    width: 18,
                    height: 18,
                    opacity: 0.6,
                    right: 4,
                  }}
                />
                <Text style={{ fontSize: 14, color: colors.grey }}>
                  {`(${index + 1} of ${activityFlow.order.length}) Morning routine`}
                </Text>
              </View>
            </View>

            <Button full rounded onPress={onSubmit} style={{ marginTop: 25 }}>
              <Text style={{ fontFamily: theme.fontFamily, fontSize: 17, fontWeight: "bold" }}>
                {i18n.t("change_study:submit")}
              </Text>
            </Button>
            <Button full transparent onPress={onBack} style={{ marginTop: 10 }}>
              <Text style={{ fontFamily: theme.fontFamily, fontSize: 17, fontWeight: "bold" }}>
                {i18n.t("activity_navigation:back")}
              </Text>
            </Button>
          </>
        }
      </View>
    </ImageBackground>
  );
};

ActivityFlowSubmit.propTypes = {};

const mapStateToProps = (state) => ({
  currentApplet: currentAppletSelector(state),
  currentResponses: currentResponsesSelector(state),
  orderIndex: state.activities.orderIndex,
});

const mapDispatchToProps = {
  nextActivity
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityFlowSubmit);
