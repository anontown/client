/* tslint:disable */
// This file was automatically generated and should not be edited.

import { ProfileQuery } from "../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: Test
// ====================================================

export interface Test_profiles {
  __typename: "Profile";
  id: string;
  name: string;
  sn: string;
  date: GQLDateTime;
}

export interface Test {
  profiles: Test_profiles[];
}

export interface TestVariables {
  q: ProfileQuery;
}
