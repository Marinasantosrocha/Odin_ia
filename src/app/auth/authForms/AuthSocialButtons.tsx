import CustomSocialButton from "@/app/components/forms/theme-elements/CustomSocialButton";
import { Stack } from "@mui/system";
import { Avatar, Box } from "@mui/material";

const AuthSocialButtons = () => (
  <>
    <Stack direction="row" justifyContent="center" spacing={2} mt={3}>
      <CustomSocialButton>
        <Avatar
          src={"/images/svgs/google-icon.svg"}
          alt={"icon1"}
          sx={{
            width: 16,
            height: 16,
            borderRadius: 0,
            mr: 1,
          }}
        />
        Google
      </CustomSocialButton>
      <CustomSocialButton>
        <Avatar
          src={"/images/svgs/facebook-icon.svg"}
          alt={"icon2"}
          sx={{
            width: 25,
            height: 25,
            borderRadius: 0,
            mr: 1,
          }}
        />
        Facebook
      </CustomSocialButton>
    </Stack>
  </>
);

export default AuthSocialButtons;
