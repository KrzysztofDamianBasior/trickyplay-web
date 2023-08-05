import React, { useState } from "react";

import { Form, Formik, FormikConfig, FormikHelpers } from "formik";

import FormNavigation from "./FormNavigation";
import type { SignUpFormFieldsType } from "./SignUp";

import Step from "@mui/material/Step";
import { Stepper } from "@mui/material";
import StepLabel from "@mui/material/StepLabel";

interface Props extends FormikConfig<SignUpFormFieldsType> {
  children: React.ReactNode;
}

const MultiStepForm = ({ children, initialValues, onSubmit }: Props) => {
  const [stepNumber, setStepNumber] = useState(0);
  const [snapshot, setSnapshot] = useState(initialValues);
  const steps = React.Children.toArray(children) as React.ReactElement[];

  const step = steps[stepNumber];
  const totalSteps = steps.length;
  const isLastStep = stepNumber === totalSteps - 1;

  const next = (values: SignUpFormFieldsType) => {
    setSnapshot(values);
    setStepNumber(stepNumber + 1);
  };
  const previous = (values: SignUpFormFieldsType) => {
    setSnapshot(values);
    setStepNumber(stepNumber - 1);
  };

  const handleSubmit = async (
    values: SignUpFormFieldsType,
    actions: FormikHelpers<SignUpFormFieldsType>
  ) => {
    if (step.props.onSubmit) {
      await step.props.onSubmit(values);
    }

    if (isLastStep) {
      return onSubmit(values, actions);
    } else {
      actions.setTouched({});
      next(values);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={step.props.validationSchema}
    >
      {(formik) => (
        <Form onSubmit={formik.handleSubmit} style={{ marginTop: "10px" }}>
          <Stepper activeStep={stepNumber} alternativeLabel>
            {steps.map((currentStep) => {
              const label = currentStep.props.stepName;

              return (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {step}

          <FormNavigation
            isLastStep={isLastStep}
            hasPrevious={stepNumber > 0}
            onBackClick={() => previous(formik.values)}
            isDisabled={!formik.isValid || formik.isSubmitting}
            isSubmitting={formik.isSubmitting}
          />
        </Form>
      )}
    </Formik>
  );
};

export default MultiStepForm;
