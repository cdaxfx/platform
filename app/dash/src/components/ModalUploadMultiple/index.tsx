import { useCallback, useRef, useState } from 'react';

import { Button, Column, Icon, Text, useTheme } from '@cdaxfx/ui';
import { Modal } from 'antd';

import {
  Container,
  FileContainer,
  HiddenFileInput,
  SelectPictureContainer,
} from './styles';

interface IProps {
  isVisible: boolean;
  title: string;
  description?: string;
  onClose(value: false): void;
  onConfirm(value: File[]): void;
}

export const ModalUploadMultiple: React.FC<IProps> = ({
  isVisible,
  onClose,
  onConfirm,
  title,
  description,
}) => {
  const { theme } = useTheme();

  const [filesSelected, setFilesSelected] = useState<File[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;

    if (files) {
      setFilesSelected((prevFiles) => [...prevFiles, ...Array.from(files)]);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer.files;
    if (files) {
      setFilesSelected((prevFiles) => [...prevFiles, ...Array.from(files)]);
    }
  };

  const handleSubmit = useCallback(() => {
    if (filesSelected.length === 0) return;

    onConfirm(filesSelected);
    // filesSelected.forEach((file) => onConfirm(file));
    onClose(false);
  }, [filesSelected, onClose, onConfirm]);

  return (
    <Modal
      onCancel={() => onClose(false)}
      open={isVisible}
      footer={() => null}
      width={600}
      centered={true}
    >
      <Container>
        <Text variant="body_md_bold">{title}</Text>
        {description && (
          <Text
            variant="body_sm_regular"
            color={theme.textColor.layout.secondary.value}
          >
            {description}
          </Text>
        )}

        <Column width="100%" align="center" justify="center" gap="xxs">
          {filesSelected.length === 0 ? (
            <SelectPictureContainer
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(event) => event.preventDefault()}
            >
              <HiddenFileInput
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                multiple
                accept="image/*,.pdf,.txt,.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              />
              <Icon
                variant="inbox"
                color={theme.textColor.layout.emphasized.value}
                size="lg"
              />
              <Text variant="body_md_bold">
                Click or drag files here to upload
              </Text>
            </SelectPictureContainer>
          ) : (
            <FileContainer>
              {filesSelected.map((file, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                  <Text variant="caption_regular">{file.name}</Text>
                  <Icon
                    onClick={() =>
                      setFilesSelected((prevFiles) =>
                        prevFiles.filter((_, i) => i !== index)
                      )
                    }
                    style={{ cursor: 'pointer' }}
                    variant="cross-circle"
                    size="sm"
                  />
                </div>
              ))}
            </FileContainer>
          )}
          <Text
            variant="caption_regular"
            color={theme.textColor.layout.secondary.value}
          >
            {filesSelected.length} {filesSelected.length === 1 ? 'file' : 'files'} loaded
          </Text>
        </Column>

        <Button
          disabled={filesSelected.length === 0}
          text="Submit"
          roundness="rounded"
          style={{ alignSelf: 'flex-end', marginTop: 32 }}
          onClick={() => handleSubmit()}
        />
      </Container>
    </Modal>
  );
};
