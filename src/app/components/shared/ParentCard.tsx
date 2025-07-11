"use client"

import React, { useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import { Card, CardHeader, CardContent, Divider, Box } from '@mui/material';
import { CustomizerContext } from '@/app/context/customizerContext';

type Props = {
  title: string;
  footer?: string | any;
  codeModel?: React.ReactNode;
  children: React.ReactNode;
};

const ParentCard = ({ title, children, footer, codeModel }: Props) => {

  const theme = useTheme();
  const borderColor = theme.palette.divider;
  const { isCardShadow } = useContext(CustomizerContext);

  return (
    <Card
      sx={{ padding: 0, border: !isCardShadow ? `1px solid ${borderColor}` : 'none' }}
      elevation={isCardShadow ? 9 : 0}
      variant={!isCardShadow ? 'outlined' : undefined}
    >
      <CardHeader title={title} action={codeModel} />
      <Divider />

      <CardContent>{children}</CardContent>
      {footer ? (
        <>
          <Divider />
          <Box p={3}>{footer}</Box>
        </>
      ) : (
        ''
      )}
    </Card>
  );
};

export default ParentCard;
