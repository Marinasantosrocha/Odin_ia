import * as React from "react";
import { Grid, Rating, Stack } from "@mui/material";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import ParentCard from "@/app/components/shared/ParentCard";
import ChildCard from "@/app/components/shared/ChildCard";

import Controlled from "@/app/components/ui-components/rating/Controlled";
import CustomIconSet from "@/app/components/ui-components/rating/CustomIconSet";
import Disabled from "@/app/components/ui-components/rating/Disabled";
import HoverFeedback from "@/app/components/ui-components/rating/HoverFeedback";
import NoRating from "@/app/components/ui-components/rating/NoRating";
import RadioGroup from "@/app/components/ui-components/rating/RadioGroup";
import ReadOnly from "@/app/components/ui-components/rating/ReadOnly";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Rating",
  },
];

const MuiRating = () => {


  return (
    (<PageContainer title="Rating" description="this is Rating">
      {/* breadcrumb */}
      <Breadcrumb title="Rating" items={BCrumb} />
      {/* end breadcrumb */}
      <ParentCard title="Rating">
        <Grid container spacing={3}>
          <Grid
            display="flex"
            alignItems="stretch"
            size={{
              xs: 12,
              lg: 4,
              sm: 6
            }}>
            <Controlled />
          </Grid>
          <Grid
            display="flex"
            alignItems="stretch"
            size={{
              xs: 12,
              lg: 4,
              sm: 6
            }}>
            <ReadOnly />
          </Grid>
          <Grid
            display="flex"
            alignItems="stretch"
            size={{
              xs: 12,
              lg: 4,
              sm: 6
            }}>
            <Disabled />
          </Grid>
          <Grid
            display="flex"
            alignItems="stretch"
            size={{
              xs: 12,
              lg: 4,
              sm: 6
            }}>
            <NoRating />
          </Grid>
          <Grid
            display="flex"
            alignItems="stretch"
            size={{
              xs: 12,
              lg: 4,
              sm: 6
            }}>
            <ChildCard title="Rating precision">
              <Rating name="half-rating" defaultValue={2.5} precision={0.5} />
            </ChildCard>
          </Grid>
          <Grid
            display="flex"
            alignItems="stretch"
            size={{
              xs: 12,
              lg: 4,
              sm: 6
            }}>
            <HoverFeedback />
          </Grid>

          <Grid
            display="flex"
            alignItems="stretch"
            size={{
              xs: 12,
              lg: 4,
              sm: 6
            }}>
            <CustomIconSet />
          </Grid>
          <Grid
            display="flex"
            alignItems="stretch"
            size={{
              xs: 12,
              lg: 4,
              sm: 6
            }}>
            <ChildCard title="10 Stars">
              <Rating name="customized-10" defaultValue={2} max={10} />
            </ChildCard>
          </Grid>
          <Grid
            display="flex"
            alignItems="stretch"
            size={{
              xs: 12,
              lg: 4,
              sm: 6
            }}>
            <RadioGroup />
          </Grid>
          <Grid
            display="flex"
            alignItems="stretch"
            size={{
              xs: 12,
              lg: 4,
              sm: 6
            }}>
            <ChildCard title="Sizes">
              <Stack spacing={2}>
                <Rating name="size-small" defaultValue={2} size="small" />
                <Rating name="size-medium" defaultValue={2} />
                <Rating name="size-large" defaultValue={2} size="large" />
              </Stack>
            </ChildCard>
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>)
  );
};
export default MuiRating;
