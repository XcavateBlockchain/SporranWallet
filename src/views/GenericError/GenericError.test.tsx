import {
  mockDialogShowModal,
  render,
  waitForDialogUpdate,
} from '../../testing/testing';
import { GenericError } from './GenericError';

describe('GenericError', () => {
  beforeEach(mockDialogShowModal);

  it('should render children when no error happens', async () => {
    const { container } = render(
      <GenericError>
        <span>Pass</span>
      </GenericError>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render generic error when an error happens', async () => {
    function Failure(): JSX.Element {
      throw new Error('Testing GenericError');
    }

    const logger = jest.spyOn(console, 'error');
    logger.mockImplementation(() => undefined);

    const { container } = render(
      <GenericError>
        <Failure />
      </GenericError>,
    );

    await waitForDialogUpdate();
    expect(container).toMatchSnapshot();

    logger.mockRestore();
  });
});
