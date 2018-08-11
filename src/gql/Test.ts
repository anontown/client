/* tslint:disable */
// This file was automatically generated and should not be edited.

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
