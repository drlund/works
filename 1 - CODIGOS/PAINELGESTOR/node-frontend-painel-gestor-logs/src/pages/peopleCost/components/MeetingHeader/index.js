import { Divider } from 'antd';
import { MeetingSlider } from './MeetingSlider';
import { MeetingTexts } from './MeetingTexts';

export function MeetingHeader() {
  return (
    <div style={{ marginBottom: '2em' }}>
      <MeetingTexts />
      <Divider />
      <MeetingSlider />
    </div>
  );
}
