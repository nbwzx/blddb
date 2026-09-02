import { Step } from "react-joyride";

export interface TourStep extends Step {
  route: string;
}

export interface AppState {
  run: boolean;
  stepIndex: number;
  steps: TourStep[];
  tourActive: boolean;
}
