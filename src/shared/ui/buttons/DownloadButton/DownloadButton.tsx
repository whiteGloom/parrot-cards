import React, {FC, useMemo, useEffect} from 'react';
import {LinkButton, LinkButtonDefaultTypes} from '../../links/LinkButton/LinkButton';

type DownloadButtonPropsType = {
  dumpString: string;
  fileName: string;
  fileExtension: string;
};

export const DownloadButton: FC<DownloadButtonPropsType> = (props) => {
  const exportData = useMemo(() => {
    const file = new Blob([props.dumpString], {type: props.fileExtension});

    return {
      file,
      url: URL.createObjectURL(file),
    };
  }, [props.dumpString, props.fileExtension]);

  useEffect(() => {
    return () => URL.revokeObjectURL(exportData.url);
  }, [exportData]);

  return (
    <LinkButton
      to={exportData.url}
      download={props.fileName}
      theme={LinkButtonDefaultTypes.Accent}
    >
      Download
    </LinkButton>
  );
};